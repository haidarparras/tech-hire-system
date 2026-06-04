FROM python:3.10-slim

# Set working directory di dalam container
WORKDIR /code

# Copy requirements dan install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy seluruh isi folder api ke dalam container
COPY . .

# Jalankan FastAPI menggunakan uvicorn di port 7860 (Port wajib Hugging Face)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]