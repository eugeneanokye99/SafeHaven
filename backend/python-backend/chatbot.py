import json
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, TimeDistributed
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Step 1: Combining Datasets
# Load existing human and robot texts
with open('./dataset/human_text.txt', 'r') as file:
    human_text = file.readlines()

with open('./dataset/robot_text.txt', 'r') as file:
    robot_text = file.readlines()

# Load dialogs.txt
with open('./dataset/dialogs.txt', 'r') as file:
    dialogs = file.readlines()

# Load Conversation.csv
conversation_df = pd.read_csv('./dataset/Conversation.csv')
csv_human_text = conversation_df['question'].tolist()
csv_robot_text = conversation_df['answer'].tolist()

# Load starwarsintents.json
with open('./dataset/starwarsintents.json', 'r') as file:
    starwars_intents = json.load(file)

# Load intents.json (uploaded file)
with open('./dataset/intents.json', 'r') as file:
    intents_data = json.load(file)

# Extract intents from starwarsintents.json
intents_human_text = []
intents_robot_text = []

for intent in starwars_intents['intents']:
    for pattern in intent['patterns']:
        intents_human_text.append(pattern)
        intents_robot_text.append(np.random.choice(intent['responses']))

# Extract intents from intents.json (uploaded file)
for intent in intents_data['intents']:
    for pattern in intent['patterns']:
        intents_human_text.append(pattern)
        intents_robot_text.append(np.random.choice(intent['responses']))

# Combine all datasets into conversations
conversations = []
for human, robot in zip(human_text, robot_text):
    conversations.append({"human": human.strip(), "robot": robot.strip()})

for dialog in dialogs:
    parts = dialog.strip().split('::')
    if len(parts) == 2:
        conversations.append({"human": parts[0].strip(), "robot": parts[1].strip()})

for human, robot in zip(csv_human_text, csv_robot_text):
    conversations.append({"human": human.strip(), "robot": robot.strip()})

for human, robot in zip(intents_human_text, intents_robot_text):
    conversations.append({"human": human.strip(), "robot": robot.strip()})

# Save combined conversations to a JSON file
with open('./models/conversations.json', 'w') as file:
    json.dump(conversations, file)

# Step 2: Preprocessing Data
with open('./models/conversations.json', 'r') as file:
    conversations = json.load(file)

human_texts = [conv['human'] for conv in conversations]
robot_texts = [conv['robot'] for conv in conversations]

tokenizer = Tokenizer()
tokenizer.fit_on_texts(human_texts + robot_texts)

with open('./models/tokenizer.json', 'w') as file:
    json.dump(tokenizer.to_json(), file)

input_sequences = tokenizer.texts_to_sequences(human_texts)
target_sequences = tokenizer.texts_to_sequences(robot_texts)

max_length = 20
input_sequences = pad_sequences(input_sequences, maxlen=max_length, padding='post')
target_sequences = pad_sequences(target_sequences, maxlen=max_length, padding='post')

# Save max_length to a file
with open('./models/max_length.txt', 'w') as f:
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
model.save('./models/chatbot_model.keras')
