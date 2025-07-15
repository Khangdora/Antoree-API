// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Load mock data with error handling
let courses = [];
let instructors = [];
let reviews = [];
let users = [];

try {
  courses = require('./mock-data/courses.json').filter(course => 
    course && course.id && course.title
  );
  instructors = require('./mock-data/instructors.json');
  reviews = require('./mock-data/course_reviews.json');
  users = require('./mock-data/users.json');
  
  console.log(`Loaded: ${courses.length} courses, ${instructors.length} instructors, ${reviews.length} reviews, ${users.length} users`);
} catch (error) {
  console.error('Error loading mock data:', error.message);
}

// Get all courses with filtering and pagination
app.get('/api/courses', (req, res) => {
  try {
    const { 
      q = '', 
      category = '', 
      level = '', 
      page = 1, 
      limit = 12,
      sort = 'title'
    } = req.query;

    let filtered = courses.filter(course => {
      const matchSearch = !q || 
        course.title?.toLowerCase().includes(q.toLowerCase()) ||
        course.description?.toLowerCase().includes(q.toLowerCase()) ||
        course.category?.toLowerCase().includes(q.toLowerCase());
      
      const matchCategory = !category || course.category === category;
      const matchLevel = !level || course.level === level;
      
      return matchSearch && matchCategory && matchLevel;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews':
          return (b.number_of_reviews || 0) - (a.number_of_reviews || 0);
        default:
          return (a.title || '').localeCompare(b.title || '');
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = filtered.slice(startIndex, endIndex);

    // Add instructor info to each course
    const coursesWithInstructors = paginatedCourses.map(course => {
      const instructor = instructors.find(i => i.id === course.instructor_id);
      const courseReviewCount = reviews.filter(r => r.course_id === course.id).length;
      
      return {
        ...course,
        instructor: instructor ? {
          id: instructor.id,
          fullname: instructor.fullname,
          avatar: instructor.avatar
        } : null,
        actual_review_count: courseReviewCount
      };
    });

    res.json({
      courses: coursesWithInstructors,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(filtered.length / limit),
        total_courses: filtered.length,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Get featured/bestseller courses - MUST BE BEFORE /:id route
app.get('/api/courses/featured', (req, res) => {
  try {
    const featuredCourses = courses
      .filter(course => course.is_bestseller === 1 || course.rating >= 4.8)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8)
      .map(course => {
        const instructor = instructors.find(i => i.id === course.instructor_id);
        return {
          ...course,
          instructor: instructor ? {
            id: instructor.id,
            fullname: instructor.fullname,
            avatar: instructor.avatar
          } : null
        };
      });

    res.json(featuredCourses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Get course detail by ID - MUST BE AFTER /featured route
app.get('/api/courses/:id', (req, res) => {
  try {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const instructor = instructors.find(i => i.id === course.instructor_id);
    const courseReviews = reviews.filter(r => r.course_id === course.id);
    
    // Add user info to reviews
    const reviewsWithUsers = courseReviews.map(review => {
      const user = users.find(u => u.id === review.user_id);
      return {
        ...review,
        user: user ? {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          avatar: user.avatar
        } : null
      };
    });

    // Get related courses (same category, different course)
    const relatedCourses = courses
      .filter(c => c.category === course.category && c.id !== course.id)
      .slice(0, 4)
      .map(relatedCourse => {
        const relatedInstructor = instructors.find(i => i.id === relatedCourse.instructor_id);
        return {
          ...relatedCourse,
          instructor: relatedInstructor ? {
            id: relatedInstructor.id,
            fullname: relatedInstructor.fullname,
            avatar: relatedInstructor.avatar
          } : null
        };
      });

    res.json({ 
      ...course, 
      instructor, 
      reviews: reviewsWithUsers,
      related_courses: relatedCourses,
      stats: {
        total_reviews: courseReviews.length,
        average_rating: courseReviews.length > 0 
          ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length 
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Get all instructors
app.get('/api/instructors', (req, res) => {
  try {
    const instructorsWithCourses = instructors.map(instructor => {
      const instructorCourses = courses.filter(c => c.instructor_id === instructor.id);
      const totalStudents = instructorCourses.reduce((sum, course) => sum + (course.number_of_reviews || 0), 0);
      
      return {
        ...instructor,
        course_count: instructorCourses.length,
        total_students: totalStudents,
        average_rating: instructorCourses.length > 0
          ? instructorCourses.reduce((sum, course) => sum + (course.rating || 0), 0) / instructorCourses.length
          : 0
      };
    });

    res.json(instructorsWithCourses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Get instructor by ID
app.get('/api/instructors/:id', (req, res) => {
  try {
    const instructor = instructors.find(i => i.id === req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    const instructorCourses = courses.filter(c => c.instructor_id === instructor.id);
    const allReviews = reviews.filter(r => 
      instructorCourses.some(course => course.id === r.course_id)
    );

    res.json({
      ...instructor,
      courses: instructorCourses,
      stats: {
        total_courses: instructorCourses.length,
        total_students: instructorCourses.reduce((sum, course) => sum + (course.number_of_reviews || 0), 0),
        total_reviews: allReviews.length,
        average_rating: allReviews.length > 0
          ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];
    const categoriesWithCount = categories.map(category => ({
      name: category,
      course_count: courses.filter(c => c.category === category).length
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      total_courses: courses.length,
      total_instructors: instructors.length,
      total_users: users.length,
      total_reviews: reviews.length,
      categories: [...new Set(courses.map(c => c.category).filter(Boolean))].length,
      average_rating: courses.length > 0 
        ? courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length 
        : 0,
      bestseller_count: courses.filter(c => c.is_bestseller === 1).length,
      new_courses_count: courses.filter(c => c.is_new === 1).length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    data_loaded: {
      courses: courses.length,
      instructors: instructors.length,
      reviews: reviews.length,
      users: users.length
    }
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Courses: http://localhost:${PORT}/api/courses`);
  console.log(`⭐ Featured: http://localhost:${PORT}/api/courses/featured`);
  console.log(`👨‍🏫 Instructors: http://localhost:${PORT}/api/instructors`);
});