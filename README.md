# Antoree API - Mock Learning Platform API

A comprehensive REST API server providing mock data for an online learning platform. Built with Express.js and designed for easy deployment on cloud platforms like Render.

## 🚀 Features

- **Complete Course Management**: Full CRUD-like operations for courses with filtering, pagination, and sorting
- **Instructor Profiles**: Detailed instructor information with course statistics
- **Course Reviews System**: User reviews and ratings for courses
- **Category Management**: Course categorization with statistics
- **Search & Filtering**: Advanced search capabilities across courses
- **Pagination Support**: Efficient data loading with pagination
- **CORS Enabled**: Ready for frontend integration

## 📊 API Endpoints

### Health Check
- `GET /api/health` - API health status and data summary

### Courses
- `GET /api/courses` - Get all courses with filtering and pagination
  - Query parameters: `q`, `category`, `level`, `page`, `limit`, `sort`
- `GET /api/courses/featured` - Get featured/bestseller courses
- `GET /api/courses/:id` - Get detailed course information

### Instructors
- `GET /api/instructors` - Get all instructors with course statistics
- `GET /api/instructors/:id` - Get detailed instructor information

### Categories & Stats
- `GET /api/categories` - Get all course categories with counts
- `GET /api/stats` - Get platform statistics

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd antoree-api

# Install dependencies
npm install

# Start the development server
npm start
```

The server will start on `http://localhost:3000`

### Environment Variables
- `PORT` - Server port (default: 3000)

## 📁 Project Structure

```
antoree-api/
├── index.js              # Main server file
├── package.json           # Dependencies and scripts
├── README.md             # This file
└── mock-data/            # Mock data files
    ├── users.json        # User profiles
    ├── instructors.json  # Instructor profiles
    ├── courses.json      # Course catalog
    └── course_reviews.json # Course reviews
```

## 🎯 API Usage Examples

### Get All Courses with Filtering
```bash
curl "http://localhost:3000/api/courses?category=Ngoại ngữ&page=1&limit=5&sort=rating"
```

### Search Courses
```bash
curl "http://localhost:3000/api/courses?q=IELTS"
```

### Get Course Details
```bash
curl "http://localhost:3000/api/courses/KH011"
```

### Get Platform Statistics
```bash
curl "http://localhost:3000/api/stats"
```

## 📦 Dependencies

- **Express.js 4.18.2** - Web framework
- **CORS 2.8.5** - Cross-origin resource sharing

## 🌐 Deployment

### Render Deployment
1. Push your code to a Git repository
2. Connect your repository to Render
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Deploy!

### Environment Setup for Production
- Set `PORT` environment variable if needed
- Ensure all mock data files are included in deployment

## 📝 Data Schema

### Course Object
```json
{
  "id": "KH011",
  "title": "Course Title",
  "category": "Category Name",
  "price": 999000,
  "rating": 4.8,
  "instructor_id": "GV001",
  "number_of_reviews": 156,
  "is_bestseller": 1,
  "level": "Beginner"
}
```

### Instructor Object
```json
{
  "id": "GV001",
  "fullname": "Instructor Name",
  "avatar": "avatar-url",
  "bio_snippet": "Brief bio"
}
```

### Review Object
```json
{
  "id": "1",
  "course_id": "KH011",
  "user_id": "1",
  "rating": 5,
  "comment": "Review text",
  "date": "2024-01-15"
}
```

## 🔧 Development

### Adding New Endpoints
1. Add your route handler in `index.js`
2. Follow the existing error handling pattern
3. Test your endpoint
4. Update this README

### Mock Data Management
- JSON files in `mock-data/` directory
- Automatically loaded on server start
- Edit files directly for data changes

## 📈 Performance Notes

- All data is loaded into memory for fast access
- Pagination implemented for large datasets
- Efficient filtering and sorting algorithms
- CORS enabled for frontend integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - feel free to use this project for learning and development purposes.

---

**Ready for deployment!** 🚀

This API is production-ready and can be deployed to any cloud platform that supports Node.js applications.
