# PhishGuard — Phishing Email Detection System

PhishGuard is an AI-based phishing email detection system that uses a
Bidirectional Long Short-Term Memory (BiLSTM) neural network to classify
email content. The trained model is exposed through a FastAPI backend and
used by a Chrome extension for practical email analysis.

## Features

- Phishing email detection using a BiLSTM deep learning model
- Text preprocessing and tokenization
- Trained PyTorch model
- FastAPI backend for prediction
- Chrome extension integration
- Training and evaluation notebook
- Accuracy, loss and evaluation visualizations

## Project Structure

```text
PhishGuard/
├── ai_model/
│   ├── preprocessing/
│   │   └── preprocess.py
│   ├── saved_models/
│   │   ├── best_phishguard_model.pth
│   │   ├── lstm_model.pth
│   │   ├── tokenizer.pkl
│   │   └── vocab.pkl
│   ├── model.py
│   ├── predict.py
│   └── __init__.py
│
├── backend/
│   ├── main.py
│   └── __init__.py
│
├── dataset/
│   └── README.md
│
├── notebooks/
│   └── main.ipynb
│
├── phishguard-extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── styles.css
│   └── icons/
│
├── .env.example
├── .gitignore
├── LICENSE
├── requirements.txt
└── README.md
```

## Machine Learning Pipeline

```text
Email Text
    ↓
Text Preprocessing
    ↓
Tokenization
    ↓
Vocabulary / Sequence Representation
    ↓
BiLSTM Model
    ↓
Prediction
    ↓
Phishing / Legitimate
```

## Technologies

- Python
- PyTorch
- FastAPI
- Uvicorn
- Pandas
- NumPy
- Scikit-learn
- NLTK
- Matplotlib
- HTML / CSS / JavaScript
- Chrome Extension APIs

## Dataset

The project was trained using phishing/spam email datasets, including CEAS.
The complete dataset is not included in this repository.

See `dataset/README.md` for details.

## Running the Backend

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/PhishGuard.git
cd PhishGuard
```

### 2. Create a virtual environment

Windows:

```powershell
python -m venv venv
venv\Scriptsctivate
```

### 3. Install dependencies

```powershell
pip install -r requirements.txt
```

### 4. Start the FastAPI server

```powershell
uvicorn backend.main:app --reload
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is normally available at:

```text
http://127.0.0.1:8000/docs
```

## Chrome Extension

1. Start the FastAPI backend.
2. Open Chrome.
3. Go to `chrome://extensions/`.
4. Enable **Developer mode**.
5. Select **Load unpacked**.
6. Choose the `phishguard-extension` folder.
7. Open Gmail and test the extension.

Make sure the API URL configured in the extension matches the backend URL.

## Training

The training and evaluation workflow is documented in:

```text
notebooks/main.ipynb
```

The notebook contains preprocessing, model training, validation and evaluation steps.

## Model

The trained model artifacts are stored under:

```text
ai_model/saved_models/
```

The repository currently includes the trained model because the model files are small enough for this project.

## Evaluation

The repository contains evaluation/training visualizations generated during development.

These can be placed in a `screenshots/` or `results/` folder if you want to present them separately on the GitHub README.

## Security

Do not commit:

- `.env` files
- API keys
- passwords
- database credentials
- private tokens
- local virtual environments

Use `.env.example` as the template for environment configuration.

## Author

**Muhammad Talha**

PhishGuard was developed as a Final Year   academic machine learning project focused on
detecting phishing emails using deep learning.
