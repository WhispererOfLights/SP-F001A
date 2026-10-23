import unittest

from scripts.create_demo_of import build_demo_document


class DemoWorkOrderTests(unittest.TestCase):
    def test_demo_covers_the_main_business_cases(self):
        entry, document = build_demo_document()

        self.assertEqual(entry["of"], "Demo")
        self.assertEqual(entry["codeArticle"], "123456789")
        self.assertEqual(entry["otp"], "SP-F0001")
        self.assertEqual([unit["sn"] for unit in document["units"]["rows"]], [
            "DEMO1", "DEMO2", "DEMO3", "DEMO4", "DEMO5",
        ])
        self.assertEqual({row["action1"] for row in document["rework"]["rows"]}, {"S", "D", "M", "P", "R", "O"})
        self.assertEqual({row["type"] for row in document["faits"]["rows"]}, {"NC", "DM", "ISS", "OW"})
        self.assertTrue(any(row.get("deleted") for row in document["rework"]["rows"]))
        self.assertTrue(any(not row.get("validated") for row in document["rework"]["rows"]))
        self.assertTrue(any(row.get("sortieDT") for row in document["etuvage"]["rows"]))
        self.assertTrue(any(row.get("entreeDT") and not row.get("sortieDT") for row in document["etuvage"]["rows"]))
        self.assertTrue(any(not row.get("duree") for row in document["etuvage"]["rows"]))


if __name__ == "__main__":
    unittest.main()
