import unittest

import server


def climate_page(sensors, alarm="false", source_time="07:30:00"):
    lines = [
        'var date = ["2026.11.20"];',
        f'var time = ["{source_time}"];',
        f"var etat_buzzer = {alarm};",
    ]
    for suffix, values in sensors.items():
        lines.extend([
            f"var temperature_{suffix} = [{values['temperature']}];",
            f"var humidite_{suffix} = [{values['humidity']}];",
            f"var pression_{suffix} = [{values['pressure']}];",
            f"var consigne_alarme_temperature_{suffix}_bas = [19];",
            f"var consigne_alarme_temperature_{suffix}_haut = [25];",
            f"var consigne_alarme_humidite_{suffix}_bas = [45];",
            f"var consigne_alarme_humidite_{suffix}_haut = [65];",
            f"var consigne_alarme_pression_{suffix}_bas = [{values['pressure_min']}];",
            f"var consigne_alarme_pression_{suffix}_haut = [{values['pressure_max']}];",
        ])
    return "\n".join(lines)


class ClimateTests(unittest.TestCase):
    def setUp(self):
        self.page_one = climate_page({
            "01": {"temperature": 21.8, "humidity": 54.7, "pressure": 27, "pressure_min": 20, "pressure_max": 40},
            "02": {"temperature": 21.9, "humidity": 54.4, "pressure": 11, "pressure_min": 5, "pressure_max": 15},
        })
        self.page_two = climate_page({
            "03": {"temperature": 22.0, "humidity": 55.2, "pressure": 16, "pressure_min": 10, "pressure_max": 20},
        }, source_time="07:30:01")

    def test_parses_the_three_named_locations(self):
        payload = server.parse_climate_pages(self.page_one, self.page_two)

        self.assertTrue(payload["ok"])
        self.assertEqual(payload["status"], "normal")
        self.assertFalse(payload["alarmActive"])
        self.assertEqual(
            [(zone["code"], zone["label"]) for zone in payload["zones"]],
            [("#512", "Salle blanche"), ("#512a", "SAS"), ("#510", "Stock MA12")],
        )
        self.assertEqual(payload["zones"][0]["temperatureC"], 21.8)
        self.assertEqual(payload["zones"][1]["pressurePa"], 11)
        self.assertEqual(payload["zones"][2]["humidityPct"], 55.2)
        self.assertTrue(all(zone["inRange"] for zone in payload["zones"]))

    def test_reports_an_out_of_range_value(self):
        page_two = self.page_two.replace("var pression_03 = [16];", "var pression_03 = [25];")
        payload = server.parse_climate_pages(self.page_one, page_two)

        self.assertEqual(payload["status"], "out_of_range")
        self.assertTrue(payload["outOfRange"])
        self.assertEqual(payload["zones"][2]["alerts"], ["pressurePa"])

    def test_buzzer_has_priority_over_threshold_status(self):
        page_one = self.page_one.replace("var etat_buzzer = false;", "var etat_buzzer = true;")
        payload = server.parse_climate_pages(page_one, self.page_two)

        self.assertEqual(payload["status"], "alarm")
        self.assertTrue(payload["alarmActive"])


if __name__ == "__main__":
    unittest.main()
