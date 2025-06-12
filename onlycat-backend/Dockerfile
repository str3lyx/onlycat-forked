FROM ghcr.io/astral-sh/uv:python3.13-alpine

WORKDIR /onlycat-backend

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

COPY ["pyproject.toml", "uv.lock", "./"]
RUN uv sync --locked

COPY . .
EXPOSE 8000

CMD ["uv", "run", "manage.py", "runserver", "0.0.0.0:8000"]