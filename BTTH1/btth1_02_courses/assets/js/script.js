// Hàm để tải dữ liệu khóa học từ JSON
async function loadCourses() {
    try {
        const response = await fetch('data/courses.json');
        const courses = await response.json();
        displayCourses(courses);
        populateCourseSelect(courses);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu khóa học:', error);
        document.getElementById('coursesList').innerHTML = '<div class="col-12 text-center"><p class="text-danger">Không thể tải dữ liệu khóa học. Vui lòng thử lại sau.</p></div>';
    }
}

// Hàm để hiển thị danh sách khóa học dưới dạng card
function displayCourses(courses) {
    const coursesListElement = document.getElementById('coursesList');
    coursesListElement.innerHTML = '';

    courses.forEach((course, index) => {
        // Tạo delay cho hiệu ứng animation
        const delay = index * 0.1;
        
        const courseHTML = `
            <div class="col-lg-4 col-md-6 col-12 fade-in" style="animation-delay: ${delay}s">
                <div class="card course-card shadow-sm">
                    <img src="assets/images/${course.image}" class="card-img-top" alt="${course.title}">
                    <div class="card-body p-4">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text">${course.description}</p>
                        <div class="course-info">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Khai giảng: ${course.startDate}</span>
                        </div>
                        <div class="course-info">
                            <i class="fas fa-clock"></i>
                            <span>Thời lượng: ${course.duration}</span>
                        </div>
                        <div class="course-info">
                            <i class="fas fa-tags"></i>
                            <span>Học phí: <span class="badge badge-highlight px-2 py-1 rounded-pill">${course.fee}</span></span>
                        </div>
                        <div class="mt-4">
                            <a href="#contact" class="btn btn-primary">Đăng ký ngay</a>
                            <button class="btn btn-outline-secondary ms-2" data-bs-toggle="modal" data-bs-target="#courseModal" 
                                    onclick="showCourseDetails('${course.title}', '${course.description}', '${course.fee}', '${course.startDate}', '${course.duration}', '${course.image}')">
                                Chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        coursesListElement.innerHTML += courseHTML;
    });
}

// Hàm để điền danh sách khóa học vào dropdown trong form liên hệ
function populateCourseSelect(courses) {
    const courseSelect = document.getElementById('course');
    courseSelect.innerHTML = '<option selected>Chọn khóa học</option>';
    
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.title;
        option.textContent = course.title;
        courseSelect.appendChild(option);
    });
}

// Hàm hiển thị chi tiết khóa học trong modal (có thể thêm nếu cần)
function showCourseDetails(title, description, fee, startDate, duration, image) {
    // Nếu có implement modal chi tiết khóa học, code sẽ được thêm vào đây
    console.log("Hiển thị chi tiết khóa học:", title);
}

// Thêm sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Tải dữ liệu khóa học
    loadCourses();
    
    // Xử lý sự kiện submit form liên hệ
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Cảm ơn bạn đã gửi thông tin! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.');
            this.reset();
        });
    }
    
    // Thêm smooth scrolling cho tất cả các liên kết hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});