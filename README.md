# SmartFS - Smart File System

A semantic file search application that lets you find files using natural language queries instead of exact file names.

## 🌟 Overview

SmartFS revolutionizes how you search for files by understanding the **meaning** behind your search queries. Instead of remembering exact file names, simply describe what you're looking for in plain English, and SmartFS will retrieve the most relevant files based on their content.

**Example:** Type "quarterly sales report" and SmartFS will find files containing that information, even if the filename is something like "Q4_2023_final_v2.pdf"

## ✨ Features

- **Semantic Search**: Search files using natural language descriptions
- **Content-Based Retrieval**: Finds files based on what they contain, not just their names
- **Top 5 Results**: Returns the five most relevant files matching your query
- **Supported File Types**: Currently tested with text files (.txt) and PDF documents
- **Secure Authentication**: Firebase-based user authentication
- **Modern UI**: Clean, responsive interface built with React and TypeScript

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot
- **Java Version**: JDK 21
- **Database**: PostgreSQL (metadata storage)
- **Vector Database**: Qdrant (semantic search)
- **LLM Integration**: Ollama

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Styling**: Bootstrap CSS

### Authentication
- **Provider**: Firebase Authentication

## 🚀 Getting Started

### Prerequisites

- Java JDK 21
- Node.js and npm
- PostgreSQL
- Qdrant
- Ollama
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khushaalsharma/smartfs.git
   cd smartfs
   ```

2. **Backend Setup**
   ```bash
   cd api
   # Configure application.properties with your PostgreSQL and Qdrant credentials
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd smartfs-ui
   npm install
   # Configure Firebase credentials in your environment
   npm start
   ```

4. **Database Setup**
   - Ensure PostgreSQL is running
   - Ensure Qdrant is running and accessible
   - Run database migrations if applicable

## 📖 How It Works

1. **Upload Files**: Users upload text or PDF files to the system
2. **Content Extraction**: The system extracts and processes file content
3. **Vectorization**: Content is converted into vector embeddings using Ollama
4. **Storage**: Vectors are stored in Qdrant, metadata in PostgreSQL
5. **Semantic Search**: User queries are converted to vectors and matched against stored file vectors
6. **Results**: Top 5 most semantically similar files are returned

## ⚠️ Current Limitations

- **File Type Support**: Currently tested only with text (.txt) and PDF files
- **Search Accuracy**: Since the AI/ML processing is handled by Qdrant's search function, results may occasionally be inaccurate or unexpected
- **Result Limit**: Fixed to top 5 results

## 🔮 Future Enhancements

- Support for additional file formats (DOCX, XLSX, etc.)
- Custom AI/ML model integration for improved search accuracy
- Configurable result limits
- Advanced filtering options
- File preview functionality
- Batch file upload

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Khushaal Sharma - Initial work

## 🙏 Acknowledgments

- Qdrant for vector database capabilities
- Ollama for LLM integration
- Firebase for authentication services

---

**Note**: This is an experimental project and may have limitations in production environments. Use at your own discretion.
