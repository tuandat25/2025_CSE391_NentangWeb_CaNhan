// Quản lý Todo List bằng JavaScript thuần

// Class TodoList quản lý các công việc
class TodoList {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';

        // Khởi tạo ứng dụng
        this.init();
    }

    // Khởi tạo các thành phần và sự kiện
    init() {
        // Lấy các phần tử DOM
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.taskList = document.getElementById('task-list');
        this.filterButtons = document.querySelectorAll('.filter-btn');

        // Đăng ký các sự kiện
        this.taskForm.addEventListener('submit', this.addTask.bind(this));
        this.filterButtons.forEach(button => {
            button.addEventListener('click', this.filterTasks.bind(this));
        });

        // Nạp dữ liệu từ localStorage khi trang được tải
        this.loadTasksFromLocalStorage();

        // Hiển thị danh sách công việc
        this.renderTasks();
    }    // Thêm công việc mới
    addTask(event) {
        event.preventDefault();

        const taskText = this.taskInput.value.trim();

        // Kiểm tra xem taskText có rỗng không
        if (!taskText) {
            alert('Vui lòng nhập nội dung công việc!');
            return;
        }

        // Kiểm tra xem công việc đã tồn tại chưa
        const taskExists = this.tasks.some(task =>
            task.text.toLowerCase() === taskText.toLowerCase()
        );

        if (taskExists) {
            // Tạo thông báo lỗi khi công việc đã tồn tại
            const errorToast = document.createElement('div');
            errorToast.className = 'position-fixed bottom-0 end-0 p-3';
            errorToast.style.zIndex = '5';
            errorToast.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-white">
                        <strong class="me-auto">Lỗi</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Công việc đã tồn tại trong danh sách!
                    </div>
                </div>
            `;
            document.body.appendChild(errorToast);

            // Tự động ẩn toast sau 2 giây
            setTimeout(() => {
                errorToast.remove();
            }, 2000);

            return;
        }

        // Tạo đối tượng công việc mới
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        // Thêm công việc vào mảng
        this.tasks.push(newTask);

        // Lưu vào localStorage
        this.saveTasksToLocalStorage();

        // Xóa nội dung input
        this.taskInput.value = '';

        // Hiển thị lại danh sách công việc
        this.renderTasks();

        // Tạo hiệu ứng thông báo thành công
        const successToast = document.createElement('div');
        successToast.className = 'position-fixed bottom-0 end-0 p-3';
        successToast.style.zIndex = '5';
        successToast.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">Thông báo</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    Đã thêm công việc thành công!
                </div>
            </div>
        `;
        document.body.appendChild(successToast);

        // Tự động ẩn toast sau 2 giây
        setTimeout(() => {
            successToast.remove();
        }, 2000);
    }// Tạo phần tử HTML cho mỗi công việc
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `list-group-item task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        li.style.opacity = '0';
        li.style.transform = 'translateY(20px)';

        // Tạo ngày từ timestamp
        const taskDate = new Date(task.createdAt);
        const formattedDate = taskDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Tạo nội dung HTML cho task
        li.innerHTML = `
            <div class="d-flex align-items-center w-100">
                <input type="checkbox" class="form-check-input task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ms-2">${task.text}</span>
                <small class="task-date ms-auto me-2">${formattedDate}</small>
                <button class="btn btn-sm btn-danger delete-btn">Xóa</button>
            </div>
        `;

        // Gắn sự kiện cho checkbox
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleTaskStatus(task.id));

        // Gắn sự kiện cho nút xóa
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        // Gắn sự kiện cho text (click vào text cũng sẽ toggle trạng thái)
        const taskText = li.querySelector('.task-text');
        taskText.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            this.toggleTaskStatus(task.id);
        });

        return li;
    }

    // Chuyển đổi trạng thái công việc (hoàn thành/chưa hoàn thành)
    toggleTaskStatus(taskId) {
        this.tasks = this.tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });

        // Lưu vào localStorage
        this.saveTasksToLocalStorage();

        // Hiển thị lại danh sách công việc
        this.renderTasks();
    }
    // Xóa công việc
    deleteTask(taskId) {
        // Tìm phần tử DOM của task cần xóa
        const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);

        // Thêm hiệu ứng biến mất
        if (taskElement) {
            taskElement.style.opacity = '0';
            taskElement.style.transform = 'translateX(30px)';

            // Đợi hiệu ứng hoàn thành rồi mới xóa khỏi mảng và cập nhật
            setTimeout(() => {
                // Lọc bỏ task khỏi mảng
                this.tasks = this.tasks.filter(task => task.id !== taskId);

                // Lưu vào localStorage
                this.saveTasksToLocalStorage();

                // Hiển thị lại danh sách công việc
                this.renderTasks();
            }, 300);
        } else {
            // Nếu không tìm thấy phần tử, thực hiện xóa ngay
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasksToLocalStorage();
            this.renderTasks();
        }
    }

    // Lọc công việc theo trạng thái
    filterTasks(event) {
        const filterType = event.target.dataset.filter;

        // Cập nhật trạng thái nút được chọn
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');

        // Lưu loại filter hiện tại
        this.currentFilter = filterType;

        // Hiển thị lại danh sách công việc
        this.renderTasks();
    }

    // Hiển thị danh sách công việc
    renderTasks() {
        // Xóa danh sách hiện tại
        this.taskList.innerHTML = '';

        // Lọc các công việc theo bộ lọc hiện tại
        let filteredTasks = [...this.tasks];

        if (this.currentFilter === 'completed') {
            filteredTasks = this.tasks.filter(task => task.completed);
        } else if (this.currentFilter === 'incomplete') {
            filteredTasks = this.tasks.filter(task => !task.completed);
        }

        // Sắp xếp công việc theo thời gian tạo (mới nhất lên đầu)
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Hiển thị thông báo nếu không có công việc nào
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-list';
            emptyMessage.textContent = 'Không có công việc nào';
            this.taskList.appendChild(emptyMessage);
            return;
        }
        // Thêm từng công việc vào danh sách
        filteredTasks.forEach((task, index) => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);

            // Thêm hiệu ứng xuất hiện cho các task
            setTimeout(() => {
                taskElement.style.opacity = '1';
                taskElement.style.transform = 'translateY(0)';
            }, 50 * index); // Hiệu ứng tuần tự
        });
    }

    // Lưu danh sách công việc vào localStorage
    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Đọc danh sách công việc từ localStorage
    loadTasksFromLocalStorage() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }
}

// Khởi tạo ứng dụng Todo List khi trang đã được tải
document.addEventListener('DOMContentLoaded', () => {
    new TodoList();
});