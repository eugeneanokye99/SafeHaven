import json
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json

# Load the tokenizer
with open('/home/eugene-anokye/Desktop/SafeHaven/backend/python-backend/models/tokenizer.json') as f:
    data = json.load(f)
    tokenizer = tokenizer_from_json(data)

# Load max_length from file
with open('/home/eugene-anokye/Desktop/SafeHaven/backend/python-backend/models/max_length.txt', 'r') as f:
    max_length = int(f.read().strip())

def preprocess_input(input_text):
    input_sequence = tokenizer.texts_to_sequences([input_text])
    input_sequence = pad_sequences(input_sequence, maxlen=max_length, padding='post')
    return input_sequence
