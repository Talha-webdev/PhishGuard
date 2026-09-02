# AI Model

This folder contains the PhishGuard inference/training code and saved model artifacts.

Current project structure includes:

- `model.py` — BiLSTM model architecture
- `predict.py` — prediction/inference logic
- `preprocessing/` — text preprocessing code
- `saved_models/` — trained model and tokenizer/vocabulary artifacts

The trained model files are included because the PhishGuard model is small enough for this repository.

Do not commit newly generated secrets or unrelated local files here.
