import json
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, TimeDistributed
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import yaml
import glob
import requests
from bs4 import BeautifulSoup

# Function to load and extract conversations from a YAML file
def load_yaml_conversations(file_path):
    with open(file_path, 'r') as file:
        data = yaml.safe_load(file)
    human_texts = []
    robot_texts = []
    for conversation in data.get('conversations', []):
        if isinstance(conversation, list) and len(conversation) >= 2:
            human_texts.append(conversation[0].strip())
            if isinstance(conversation[1], str):
                robot_texts.append(conversation[1].strip())
            elif isinstance(conversation[1], list):
                robot_texts.append(conversation[1][0].strip())
    return human_texts, robot_texts


# Function to scrape Wikipedia Talk page data
def scrape_wikipedia_talk_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    human_texts = []
    robot_texts = []
    
    comments = soup.select('li')  # Adjust this selector based on actual HTML structure
    for i in range(0, len(comments) - 1, 2):
        human = comments[i].get_text(strip=True)
        robot = comments[i + 1].get_text(strip=True)
        human_texts.append(human)
        robot_texts.append(robot)
    
    return human_texts, robot_texts

# Function to scrape StackOverflow data
def scrape_stackoverflow(tags, num_pages=5):
    questions = []
    answers = []

    for tag in tags:
        base_url = f'https://stackoverflow.com/questions/tagged/{tag}'
        for page in range(1, num_pages + 1):
            url = f'{base_url}?tab=newest&page={page}'
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            question_summaries = soup.find_all('div', class_='summary')
            
            for summary in question_summaries:
                question_link = summary.h3.a['href']
                question_title = summary.h3.a.get_text(strip=True)
                question_url = f'https://stackoverflow.com{question_link}'
                question_response = requests.get(question_url)
                question_soup = BeautifulSoup(question_response.text, 'html.parser')
                
                question_body = question_soup.find('div', class_='s-prose js-post-body').get_text(strip=True)
                answer_bodies = question_soup.find_all('div', class_='s-prose js-post-body')
                
                questions.append(question_title)
                answers.append(question_body)
                
                for answer in answer_bodies[1:]:
                    answers.append(answer.get_text(strip=True))
    
    return questions, answers

# Function to scrape Reddit data
def scrape_reddit(subreddits, num_posts=5):
    posts = []
    comments = []

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    
    for subreddit in subreddits:
        base_url = f'https://www.reddit.com/r/{subreddit}/'
        response = requests.get(base_url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        post_links = soup.find_all('a', class_='SQnoC3ObvgnGjWt90zD9Z')
        
        for post_link in post_links[:num_posts]:
            post_url = f'https://www.reddit.com{post_link["href"]}'
            post_response = requests.get(post_url, headers=headers)
            post_soup = BeautifulSoup(post_response.text, 'html.parser')
            
            post_title = post_soup.find('h1', class_='_eYtD2XCVieq6emjKBH3m').get_text(strip=True)
            post_body = post_soup.find('div', class_='s1okktje-0 cLtrZy').get_text(strip=True)
            comment_bodies = post_soup.find_all('div', class_='s1us1wsh-0 cYyXr')
            
            posts.append(post_title)
            comments.append(post_body)
            
            for comment in comment_bodies:
                comments.append(comment.get_text(strip=True))
    
    return posts, comments

# URLs to scrape
urls = [
    'https://en.wikipedia.org/wiki/Talk:Location-based_service',
    'https://en.wikipedia.org/wiki/Talk:Ageing',
    'https://en.wikipedia.org/wiki/Talk:Public_health',
    'https://en.wikipedia.org/wiki/Talk:Computer_security',
    'https://en.wikipedia.org/wiki/Talk:Fraud',
    'https://en.wikipedia.org/wiki/Talk:Artificial_intelligence',
    'https://en.wikipedia.org/wiki/Talk:Machine_learning',
    'https://en.wikipedia.org/wiki/Talk:Deep_learning',
    'https://en.wikipedia.org/wiki/Talk:Natural_language_processing',
    'https://en.wikipedia.org/wiki/Talk:Data_science',
    'https://en.wikipedia.org/wiki/Talk:Big_data',
    'https://en.wikipedia.org/wiki/Talk:Blockchain',
    'https://en.wikipedia.org/wiki/Talk:Cybersecurity',
    'https://en.wikipedia.org/wiki/Talk:Quantum_computing',
    'https://en.wikipedia.org/wiki/Talk:Augmented_reality',
    'https://en.wikipedia.org/wiki/Talk:Virtual_reality',
    'https://en.wikipedia.org/wiki/Talk:Internet_of_things',
    'https://en.wikipedia.org/wiki/Talk:5G',
    'https://en.wikipedia.org/wiki/Talk:Artificial_intelligence',
    'https://en.wikipedia.org/wiki/Talk:Neural_network',
    'https://en.wikipedia.org/wiki/Talk:Reinforcement_learning',
    'https://en.wikipedia.org/wiki/Talk:Autonomous_vehicle',
    'https://en.wikipedia.org/wiki/Talk:Robotics',
    'https://en.wikipedia.org/wiki/Talk:Computer_vision',
    'https://en.wikipedia.org/wiki/Talk:Speech_recognition',
    'https://en.wikipedia.org/wiki/Talk:Expert_system',
    'https://en.wikipedia.org/wiki/Talk:Facial_recognition_system',
    'https://en.wikipedia.org/wiki/Talk:Genetic_algorithm',
    'https://en.wikipedia.org/wiki/Talk:Fuzzy_logic',
    'https://en.wikipedia.org/wiki/Talk:Pattern_recognition',
    'https://en.wikipedia.org/wiki/Talk:Swarm_intelligence',
    'https://en.wikipedia.org/wiki/Talk:Artificial_neural_network',
    'https://en.wikipedia.org/wiki/Talk:Knowledge_representation',
    'https://en.wikipedia.org/wiki/Talk:Logic_programming',
    'https://en.wikipedia.org/wiki/Talk:Multi-agent_system',
    'https://en.wikipedia.org/wiki/Talk:Probabilistic_logic',
    'https://en.wikipedia.org/wiki/Talk:Semantic_web',
    'https://en.wikipedia.org/wiki/Talk:Speech_synthesis',
    'https://en.wikipedia.org/wiki/Talk:Text_mining',
    'https://en.wikipedia.org/wiki/Talk:Bayesian_network',
    'https://en.wikipedia.org/wiki/Talk:Computational_creativity',
    'https://en.wikipedia.org/wiki/Talk:Hybrid_intelligence',
    'https://en.wikipedia.org/wiki/Talk:Intelligent_agent',
    'https://en.wikipedia.org/wiki/Talk:Knowledge_discovery',
    'https://en.wikipedia.org/wiki/Talk:Soft_computing',
    'https://en.wikipedia.org/wiki/Talk:Ubiquitous_computing',
    'https://en.wikipedia.org/wiki/Talk:Wearable_computer'
]

web_human_text = []
web_robot_text = []

for url in urls:
    human_texts, robot_texts = scrape_wikipedia_talk_page(url)
    web_human_text.extend(human_texts)
    web_robot_text.extend(robot_texts)

tags = [
    'python', 'javascript', 'java', 'html', 'css', 'machine-learning', 'deep-learning',
    'natural-language-processing', 'data-science', 'big-data', 'blockchain', 'cybersecurity',
    'quantum-computing', 'augmented-reality', 'virtual-reality', 'internet-of-things', '5g',
    'artificial-intelligence', 'neural-network', 'reinforcement-learning', 'autonomous-vehicles',
    'robotics', 'computer-vision', 'speech-recognition', 'expert-system', 'facial-recognition',
    'genetic-algorithm', 'fuzzy-logic', 'pattern-recognition', 'swarm-intelligence', 'knowledge-representation',
    'logic-programming', 'multi-agent-system', 'probabilistic-logic', 'semantic-web', 'speech-synthesis',
    'text-mining', 'bayesian-network', 'computational-creativity', 'hybrid-intelligence', 'intelligent-agent',
    'knowledge-discovery', 'soft-computing', 'ubiquitous-computing', 'wearable-computer', 'language'
]

# Load new datasets from CSV files
# medical_tasks_df = pd.read_csv('./dataset/prepared_generated_data_for_medical_tasks.csv')
# nhs_conversations_df = pd.read_csv('./dataset/prepared_generated_data_for_nhs_uk_conversations.csv')
# nhs_qa_df = pd.read_csv('./dataset/prepared_generated_data_for_nhs_uk_qa.csv')

# csv_human_text_medical_tasks = medical_tasks_df['text'].tolist()
# csv_robot_text_medical_tasks = medical_tasks_df['text'].tolist()

# csv_human_text_nhs_conversations = nhs_conversations_df['text'].tolist()
# csv_robot_text_nhs_conversations = nhs_conversations_df['text'].tolist()

# csv_human_text_nhs_qa = nhs_qa_df['text'].tolist()
# csv_robot_text_nhs_qa = nhs_qa_df['text'].tolist()

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

# Load conversations from multiple YAML files
yaml_files = glob.glob('./dataset/*.yml')
yaml_human_text = []
yaml_robot_text = []

for file_path in yaml_files:
    human_texts, robot_texts = load_yaml_conversations(file_path)
    yaml_human_text.extend(human_texts)
    yaml_robot_text.extend(robot_texts)

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

for human, robot in zip(yaml_human_text, yaml_robot_text):
    conversations.append({"human": human.strip(), "robot": robot.strip()})

# for human, robot in zip(web_human_text, web_robot_text):
#     conversations.append({"human": human.strip(), "robot": robot.strip()})

# for human, robot in zip(csv_human_text_medical_tasks, csv_robot_text_medical_tasks):
#     conversations.append({"human": human.strip(), "robot": robot.strip()})

# for human, robot in zip(csv_human_text_nhs_conversations, csv_robot_text_nhs_conversations):
#     conversations.append({"human": human.strip(), "robot": robot.strip()})

# for human, robot in zip(csv_human_text_nhs_qa, csv_robot_text_nhs_qa):
#     conversations.append({"human": human.strip(), "robot": robot.strip()})

# Save combined conversations to a JSON file
with open('./barbara/model/conversations.json', 'w') as file:
    json.dump(conversations, file)

# Step 2: Preprocessing Data
with open('./barbara/model/conversations.json', 'r') as file:
    conversations = json.load(file)

human_texts = [conv['human'] for conv in conversations]
robot_texts = [conv['robot'] for conv in conversations]

tokenizer = Tokenizer()
tokenizer.fit_on_texts(human_texts + robot_texts)

with open('./barbara/model/tokenizer.json', 'w') as file:
    json.dump(tokenizer.to_json(), file)

input_sequences = tokenizer.texts_to_sequences(human_texts)
target_sequences = tokenizer.texts_to_sequences(robot_texts)

max_length = 50
input_sequences = pad_sequences(input_sequences, maxlen=max_length, padding='post')
target_sequences = pad_sequences(target_sequences, maxlen=max_length, padding='post')

# Save max_length to a file
with open('./barbara/model/max_length.txt', 'w') as f:
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

model.fit(input_sequences, target_sequences, epochs=50, batch_size=16, validation_split=0.2)

# Step 5: Save the Model
model.save('./barbara/model/chatbot_model.keras')
