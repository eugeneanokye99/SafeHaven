# Elderly Safety Mobile App

## Overview

The Elderly Safety Mobile App is designed to enhance the well-being and safety of elderly individuals. The app provides users with safety tips, allows family members or caregivers to monitor their loved ones, and offers a friendly interface tailored to the needs of older adults.

## Features

- **User Authentication**: Secure login system for users and caregivers.
- **Welcome Animation**: Engaging welcome animation on successful login.
- **User Profile**: View and edit user profiles with ease.
- **Search Functionality**: Easily search for safety tips and resources.
- **Safety Tips**: Animated safety tips specifically designed for elderly users.
- **Side Drawer Navigation**: Intuitive navigation menu for easy access to app features.
- **Chatbot Assistance**: Customer service chatbot to help users with queries and provide guidance.
- **Elderly-Friendly Interface**: Simplified and accessible user interface catering to elderly users.

## Technologies Used

- **Frontend**: React Native for building cross-platform mobile applications.
- **Backend**: Node.js with Express for handling server-side logic and API endpoints.
- **Chatbot**: Custom chatbot developed with Python and TensorFlow for natural language processing.
- **Authentication**: Secure user authentication using industry-standard practices.
- **Data Management**: Integration with MongoDB for efficient data storage and retrieval.
- **Animations**: Lottie animations for a dynamic and engaging user experience.

## Installation

1. **Clone the Repository**:
```bash
git clone https://github.com/your-username/elderly-safety-mobile-app.git
cd elderly-safety-mobile-app
```


2. **Install Dependencies**:

- For the React Native app:
  ```bash
  cd mobile-app
  npm install
  ```

- For the Node.js backend:
  ```bash
  cd backend
  npm install
  ```

3. **Set Up Environment Variables**:

Create a `.env` file in the `backend` directory and add your environment variables (e.g., database connection strings, API keys).

4. **Run the Application**:

- Start the backend server:
  ```bash
  cd backend
  npm start
  ```

- Start the React Native app:
  ```bash
  cd mobile-app
  npx react-native run-android # or npx react-native run-ios
  ```

## Screenshots

![IMG_7895](https://github.com/user-attachments/assets/9788198a-07f9-4e51-a0e9-f4c581cc93e1)
![IMG_7896](https://github.com/user-attachments/assets/c78de3c7-453a-4bf2-b1d9-48f2f3e6c5cf)
![IMG_7894](https://github.com/user-attachments/assets/d234c2fd-a6a9-4bf5-b61e-e695aae6e1c5)
![IMG_7892](https://github.com/user-attachments/assets/dac67980-788e-4fe7-9a50-1c78108939a5)
![IMG_7891](https://github.com/user-attachments/assets/4651b36a-2cef-4b95-b67c-d2c74daeb259)
![IMG_7890](https://github.com/user-attachments/assets/ab365d20-9468-413c-b2a2-2f910f84123b)

## Contributing

We welcome contributions from the community. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes.
4. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
5. Push to the branch:
  ```bash
git push origin feature/your-feature
```
6. Open a pull request.


## Api Endpoints


| Endpoint                 | Method | Description                                                    |
| -------------------------| ------ | -------------------------------------------------------------- |
| /api/auth/register       | POST   | Resgister user                                                 |
| /api/auth/login          | POST   | Logs user in                                                   |
| /api/auth/upload         | POST   | Upload user profile pictures                                   |
| /api/auth/link           | POST   | Links two users                                                |
| /api/auth/search         | GET    | Gets search results of users                                   |
| /api/auth/user           | GET    | Get user data by id                                            |
| /api/chat/chatbot        | POST   | Send user query to chatbot                                     |
| /api/chat/messages       | GET    | Upload user profile pictures                                   |
| /api/chat/botmessages    | GET    | Links two users                                                |
| /api/chat/send           | POST   | Gets search results of users                                   |
| /api/chat/list           | GET    | Get user data by id                                            |
| /api/map/shared-locations| GET    | Send user query to chatbot                                     |
| /api/notifications/fetch | GET    | Send user query to chatbot                                     |


