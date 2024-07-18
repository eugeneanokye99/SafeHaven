import json
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, TimeDistributed
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Step 1: Combining Datasets
with open('human_text.txt', 'r') as file:
    human_text = file.readlines()

with open('robot_text.txt', 'r') as file:
    robot_text = file.readlines()

conversations = []
for human, robot in zip(human_text, robot_text):
    conversations.append({"human": human.strip(), "robot": robot.strip()})

with open('conversations.json', 'w') as file:
    json.dump(conversations, file)

# Step 2: Preprocessing Data
with open('conversations.json', 'r') as file:
    conversations = json.load(file)

human_texts = [conv['human'] for conv in conversations]
robot_texts = [conv['robot'] for conv in conversations]

tokenizer = Tokenizer()
tokenizer.fit_on_texts(human_texts + robot_texts)

with open('tokenizer.json', 'w') as file:
    json.dump(tokenizer.to_json(), file)

input_sequences = tokenizer.texts_to_sequences(human_texts)
target_sequences = tokenizer.texts_to_sequences(robot_texts)

max_length = 20
input_sequences = pad_sequences(input_sequences, maxlen=max_length, padding='post')
target_sequences = pad_sequences(target_sequences, maxlen=max_length, padding='post')

# Save max_length to a file
with open('max_length.txt', 'w') as f:
    f.write(str(max_length))

# Step 3: Define the Model
vocab_size = len(tokenizer.word_index) + 1

model = Sequential()
model.add(Embedding(input_dim=vocab_size, output_dim=128, input_length=max_length))
model.add(LSTM(256, return_sequences=True))
model.add(TimeDistributed(Dense(vocab_size, activation='softmax')))

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Step 4: Train the Model
input_sequences = np.array(input_sequences)
target_sequences = np.array(target_sequences).reshape(*target_sequences.shape, 1)

model.fit(input_sequences, target_sequences, epochs=30, batch_size=32, validation_split=0.2)

# Step 5: Save the Model
model.save('chatbot_model.keras')
