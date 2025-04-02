## Overview

This application allows users to upload, process, and visualize time series data stored in a PostgreSQL database. It features a React.js frontend, a Python-based backend, and a PostgreSQL database for storage.

## Features

1. **CSV Upload**: Users can upload a CSV file containing time series data.
2. **Time Range Selection**: Users can specify a time range for analysis.
3. **Data Sanitization & Download**: The application processes and cleans the data, which users can download.
4. **Data Preview**: Sanitized data is displayed in a preview panel.
5. **Bar Chart Visualization**: Users can select a column for bar chart representation.
6. **Aggregation**:
   - Users can choose aggregation levels: **Daily, Monthly, Yearly**.
   - Users can select aggregation types: **Mean, Median, Sum**.
7. **Scatter Plot Visualization**: Users can define X and Y axes to generate scatter plots.

## Database Schema

The application uses a PostgreSQL database with three main tables:

### 1. `uploads` Table

Stores metadata about uploaded CSV files.

| Column      | Type                     | Description                  |
| ----------- | ------------------------ | ---------------------------- |
| upload_id   | integer (Primary Key)    | Unique identifier for upload |
| upload_time | timestamp with time zone | Upload timestamp             |
| client_ip   | character varying(15)    | IP address of the uploader   |
| file_name   | character varying(255)   | Name of the uploaded file    |

**Indexes:**

- `uploads_pkey`: Primary key on `upload_id`

**Relationships:**

- Referenced by `uploads_data` and `uploads_header_metadata`

---

### 2. `uploads_data` Table

Stores time series observations from the uploaded files.

| Column           | Type                     | Description                      |
| ---------------- | ------------------------ | -------------------------------- |
| upload_id        | integer (Foreign Key)    | Reference to `uploads.upload_id` |
| observation_time | timestamp with time zone | Time of observation              |
| data             | jsonb                    | Time series data in JSON format  |

**Indexes:**

- `uploads_data_pkey`: Primary key on `(upload_id, observation_time)`

**Foreign Keys:**

- `upload_id` references `uploads(upload_id)`

---

### 3. `uploads_header_metadata` Table

Stores metadata about the uploaded CSV file’s headers.

| Column      | Type                  | Description                        |
| ----------- | --------------------- | ---------------------------------- |
| upload_id   | integer (Foreign Key) | Reference to `uploads.upload_id`   |
| header_name | character varying     | Column name from the uploaded file |
| data_type   | character varying     | Data type of the column            |

**Indexes:**

- `uploads_header_metadata_pkey`: Primary key on `(upload_id, header_name)`

**Foreign Keys:**

- `upload_id` references `uploads(upload_id)` (on delete cascade)

## API Endpoints

The backend provides various API endpoints for handling user interactions:

### 1. File Upload

**Endpoint:** `POST /upload`

- **Description:** Uploads a CSV file to the server.
- **Payload:** Multipart file
- **Response:** JSON containing `upload_id`

### 2. Fetch Uploaded Data

**Endpoint:** `GET /data/{upload_id}?start_time={}&end_time={}`

- **Description:** Fetches sanitized data for a specific upload.
- **Response:** JSON object with time series data

## Design
![design](https://drive.google.com/uc?id=1PMr7UoBWXBqPafW3HFgnVoKhbTE3kWlt)

## Tech Stack

- **Frontend:** React.js (TypeScript, Recharts for visualizations)
- **Backend:** Python (FastAPI, Pandas for data processing)
- **Database:** PostgreSQL

## Setup and Run

### Prerequisites

Ensure you have the following installed:

- **Node.js** (for React frontend)
- **Python 3.x** (for backend)
- **PostgreSQL** (for database storage)

### Steps to Setup and Run

#### 1. Clone the Repository

```
git clone <repository-url>
cd <repository-folder>
```

#### 2. Populate .env veriables

##### server/.env

```
APP_NAME="Time Series Data Analytica"
DB_USER=<ts_analytica_user>
DB_PASSWORD=<ts_analytica_password>
DB_HOST=<host> # ex - localhost
DB_NAME=ts_data_analytica
```

##### client/.env

```
VITE_API_BASE_URL=<host>/api # ex - http://localhost:8000/api
VITE_APP_NAME="Time Series Data Analytica"
```

#### 3. Setup Backend

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload  # Start the backend server for development
```

#### 4. Setup Frontend

```
cd frontend
npm install
npm run dev  # Run the frontend in development
```

#### 5. Setup Database

- Ensure PostgreSQL is running.
- Create the required tables using provided schema.
- Configure the connection settings in the backend.

## Demo
You can watch the demo video [here](https://drive.google.com/file/d/1qCanU83ftOyjiOzyuBi87WNm3ZQ8icMt/view?usp=drive_link).

## Test Dataset
[dataset](https://drive.google.com/file/d/1FfklEjBd9C6Qcoe4hJmkCZTgZ0WEoZDW/view?usp=sharing)
