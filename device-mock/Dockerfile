FROM python:3.7.4-slim
# Alpine isn't used here intentionally because especially with python there are often major issues when compiling dependencies

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

COPY src/requirements.txt ./

RUN pip install -r /app/requirements.txt

COPY src/. .

COPY data/. ./data/.

RUN chmod +x ./entrypoint.sh

# The -u flag is important if you want to observe the logs, otherwise python buffers the output
ENTRYPOINT ["./entrypoint.sh"]