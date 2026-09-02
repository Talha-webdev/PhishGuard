import torch
import pickle
import os

from torch.nn.utils.rnn import pad_sequence

from ai_model.preprocessing.preprocess import (
    clean_text,
    tokenize_text,
    numericalize
)

from ai_model.model import PhishGuardLSTM



# Loading VOCAB here


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

vocab_path = os.path.join(
    BASE_DIR,
    "saved_models",
    "vocab.pkl"
)

with open(vocab_path, "rb") as f:
    
    vocab = pickle.load(f)



# MODEL SETTINGS


VOCAB_SIZE = len(vocab)

EMBED_DIM = 32

HIDDEN_DIM = 64

OUTPUT_DIM = 1

MAX_LEN = 200



# LOAD MODEL


model = PhishGuardLSTM(
    VOCAB_SIZE,
    EMBED_DIM,
    HIDDEN_DIM,
    OUTPUT_DIM
)

model_path = os.path.join(
    BASE_DIR,
    "saved_models",
    "best_phishguard_model.pth"
)

model.load_state_dict(
    torch.load(
        model_path,  # you already built this path correctly above
        map_location=torch.device("cpu")
    )
)

model.eval()



# PREDICTION FUNCTION


def predict_email(email_text):

    # Clean text
    cleaned = clean_text(email_text)

    # Tokenize
    tokens = tokenize_text(cleaned)

    # Numericalize
    sequence = numericalize(tokens, vocab)

    # Truncate
    sequence = sequence[:MAX_LEN]

    # Convert to tensor
    tensor_sequence = torch.tensor(sequence)

    # Padding
    padded = pad_sequence(
        [tensor_sequence],
        batch_first=True
    )

    # Prediction
    with torch.no_grad():

        output = model(padded)

        prediction = output.item()

    # Threshold
    if prediction >= 0.5:

        return "Phishing", prediction

    else:

        return "Legitimate", prediction



# TEST


if __name__ == "__main__":

    sample_email = """
    Muhammad Talha <muhammadtalhakhar@gmail.com>
Jun 14, 2026, 7:57 PM
to me

Dear Customer,

We noticed a new login to your account from an unrecognized device.

Location:
New York, United States

If this was not you, please verify your account immediately.

Verify Account:
https://account-security-verification.com

Security Team

    """

    result, confidence = predict_email(sample_email)

    print("Prediction:", result)

    print("Confidence:", confidence)