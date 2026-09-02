import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Stopwords
stop_words = set(stopwords.words('english'))


# -----------------------------
# CLEAN TEXT
# -----------------------------

def clean_text(text):

    text = re.sub(r'\W', ' ', text)

    text = re.sub(r'http\S+', '', text)

    text = re.sub(r'www\S+', '', text)

    text = re.sub(r'\d', '', text)

    text = text.lower()

    words = text.split()

    clean_words = []

    for word in words:

        if word not in stop_words:

            clean_words.append(word)

    cleaned_text = " ".join(clean_words)

    return cleaned_text


# -----------------------------
# TOKENIZATION
# -----------------------------

def tokenize_text(text):

    return word_tokenize(text)


# -----------------------------
# NUMERICALIZATION
# -----------------------------

def numericalize(tokens, vocab):

    return [
        vocab.get(word, vocab['<UNK>'])
        for word in tokens
    ]