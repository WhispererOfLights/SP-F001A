FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SP_F001A_HOST=0.0.0.0 \
    SP_F001A_PORT=5181

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home --uid 10001 spf001a && chown -R spf001a:spf001a /app
USER spf001a

EXPOSE 5181
HEALTHCHECK --interval=20s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import json,urllib.request; assert json.load(urllib.request.urlopen('http://127.0.0.1:5181/api/health',timeout=3))['ok']"

CMD ["python","-u","server.py"]
