import tensorflow as tf
import numpy as np
from sklearn.model_selection import train_test_split
import re
import json

# Load and preprocess dataset
def load_data(filepath):
    inputs = []
    responses = []
    with open(filepath, 'r') as file:
        lines = file.readlines()
        for line in lines:
            parts = line.strip().split('\t')
            if len(parts) == 2:
                inputs.append(parts[0])
                responses.append(parts[1])
    return inputs, responses

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
    return text

# Load data
inputs, responses = load_data('conversations.txt')
inputs = [preprocess_text(text) for text in inputs]
responses = [preprocess_text(text) for text in responses]

# Tokenization and padding
tokenizer = tf.keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(inputs + responses)
input_sequences = tokenizer.texts_to_sequences(inputs)
response_sequences = tokenizer.texts_to_sequences(responses)

max_length = max(len(seq) for seq in input_sequences + response_sequences)
input_sequences = tf.keras.preprocessing.sequence.pad_sequences(input_sequences, maxlen=max_length, padding='post')
response_sequences = tf.keras.preprocessing.sequence.pad_sequences(response_sequences, maxlen=max_length, padding='post')

vocab_size = len(tokenizer.word_index) + 1

# Prepare target sequences for sparse_categorical_crossentropy
response_sequences = np.array(response_sequences)

# Train-test split
input_train, input_test, response_train, response_test = train_test_split(input_sequences, response_sequences, test_size=0.2)

# Create and compile the model
model = tf.keras.models.Sequential([
    tf.keras.layers.Embedding(input_dim=vocab_size, output_dim=64),
    tf.keras.layers.LSTM(64, return_sequences=True),
    tf.keras.layers.LSTM(64, return_sequences=True),
    tf.keras.layers.TimeDistributed(tf.keras.layers.Dense(vocab_size, activation='softmax'))
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(np.array(input_train), np.expand_dims(response_train, -1), epochs=10, validation_data=(np.array(input_test), np.expand_dims(response_test, -1)))

# Save the model
model.save('chatbot_model.keras')

# Save the tokenizer
tokenizer_json = tokenizer.to_json()
with open('tokenizer.json', 'w') as json_file:
    json.dump(tokenizer_json, json_file)
