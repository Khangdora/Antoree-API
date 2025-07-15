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

### Advanced Filtering
- `GET /api/filter` - Advanced filtering with multiple criteria
  - Query parameters: `q`, `category`, `sub_category`, `min_price`, `max_price`, `level`, `page`, `limit`, `sort`, `instructor_id`

### Instructors
- `GET /api/instructors` - Get all instructors with course statistics
- `GET /api/instructors/:id` - Get detailed instructor information

### Categories & Sub-Categories
- `GET /api/categories` - Get all course categories with counts
- `GET /api/sub-categories` - Get all sub-categories with course counts
  - Query parameters: `category` (optional, to filter sub-categories by category)

### Price & Statistics
- `GET /api/price-range` - Get price range statistics and distribution
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

### Advanced Filtering with Price Range
```bash
curl "http://localhost:3000/api/filter?q=React&category=Phát triển Web&min_price=500000&max_price=1500000&sort=price_asc"
```

### Filter by Sub-Category
```bash
curl "http://localhost:3000/api/filter?sub_category=UI/UX Design&page=1&limit=10"
```

### Get Sub-Categories for a Specific Category
```bash
curl "http://localhost:3000/api/sub-categories?category=Thiết kế đồ họa"
```

### Get Price Range Statistics
```bash
curl "http://localhost:3000/api/price-range"
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

## 🔍 Advanced Filtering API (`/api/filter`)

The `/api/filter` endpoint provides comprehensive filtering capabilities with the following parameters:

### Query Parameters
- `q` - Search by course title, description, category, or sub_category
- `category` - Filter by exact or partial category match
- `sub_category` - Filter by exact or partial sub-category match
- `min_price` - Minimum price filter (considers discount prices)
- `max_price` - Maximum price filter (considers discount prices)
- `level` - Filter by course level (Cơ bản, Trung cấp, Nâng cao, Mọi cấp độ)
- `instructor_id` - Filter by specific instructor
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 12)
- `sort` - Sort options:
  - `title` - Sort by title (A-Z)
  - `price_asc` - Sort by price (low to high)
  - `price_desc` - Sort by price (high to low)
  - `rating` - Sort by rating (high to low)
  - `reviews` - Sort by number of reviews (high to low)
  - `newest` - Sort by last updated date (newest first)
  - `duration` - Sort by course duration (longest first)

### Response Format
```json
{
  "courses": [
    {
      "id": "KH001",
      "title": "Course Title",
      "category": "Category Name",
      "sub_category": "Sub Category",
      "effective_price": 990000,
      "has_discount": true,
      "instructor": {
        "id": "GV001",
        "fullname": "Instructor Name",
        "avatar": "avatar-url"
      },
      "actual_review_count": 25
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_courses": 50,
    "per_page": 12,
    "has_next": true,
    "has_prev": false
  },
  "filters_applied": {
    "search_query": "React",
    "category": "Phát triển Web",
    "sub_category": "",
    "price_range": {
      "min": 500000,
      "max": 1500000
    },
    "level": "",
    "instructor_id": ""
  },
  "statistics": {
    "total_found": 50,
    "price_range": {
      "min": 450000,
      "max": 2500000
    },
    "categories": ["Phát triển Web", "Thiết kế"],
    "sub_categories": ["Frontend", "UI/UX Design"],
    "levels": ["Cơ bản", "Trung cấp"],
    "instructors": 5
  }
}
```

## 📈 Additional API Endpoints

### Sub-Categories (`/api/sub-categories`)
Get all sub-categories with course counts, optionally filtered by main category.

**Response:**
```json
[
  {
    "name": "Frontend Development",
    "category": "Phát triển Web",
    "course_count": 5
  },
  {
    "name": "UI/UX Design",
    "category": "Thiết kế",
    "course_count": 3
  }
]
```

### Price Range Statistics (`/api/price-range`)
Get comprehensive price statistics and distribution.

**Response:**
```json
{
  "min": 450000,
  "max": 2500000,
  "average": 1050000,
  "ranges": {
    "free": 2,
    "under_500k": 5,
    "500k_1m": 8,
    "1m_2m": 12,
    "over_2m": 3
  }
}
```
