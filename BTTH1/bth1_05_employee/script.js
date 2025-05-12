// Global variables
let employees = [];
let departments = [];
let projects = [];
let modal;

// Load data from JSON file
async function loadData() {
    try {
        showLoading(true);
        const response = await fetch('data.json');
        const data = await response.json();
        
        employees = data.employees || [];
        departments = data.departments || [];
        projects = data.projects || [];
        
        // updateDashboardStats();
        populateDepartmentFilter();
        displayEmployees(employees);
        showLoading(false);
    } catch (error) {
        console.error('Error loading data:', error);
        showErrorMessage('Failed to load data. Please try again later.');
        showLoading(false);
    }
}

// Display loading spinner
function showLoading(isLoading) {
    const tableBody = document.getElementById('employeeTableBody');
    if (isLoading) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading data...</p>
                </td>
            </tr>
        `;
    }
}

// Display error message
function showErrorMessage(message) {
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4">
                <div class="alert alert-danger" role="alert">
                    ${message}
                </div>
            </td>
        </tr>
    `;
}

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('totalDepartments').textContent = departments.length;
    
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    document.getElementById('activeProjects').textContent = activeProjects;
}

// Populate department filter dropdown
function populateDepartmentFilter() {
    const departmentFilter = document.getElementById('departmentFilter');
    
    // Skip if element doesn't exist
    if (!departmentFilter) return;
    
    // Clear existing options except the first one
    departmentFilter.innerHTML = '<option value="">All Departments</option>';
    
    // Add unique departments from employee data
    const uniqueDepartments = [...new Set(employees.map(employee => employee.department))];
    
    uniqueDepartments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentFilter.appendChild(option);
    });
}

// Display employees in table
function displayEmployees(employeesToShow) {
    const tableBody = document.getElementById('employeeTableBody');
    const emptyState = document.getElementById('emptyState');
    
    tableBody.innerHTML = '';
    
    if (employeesToShow.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    
    employeesToShow.forEach(employee => {
        const row = document.createElement('tr');
        
        // Create badge for status with appropriate color
        let statusClass = 'secondary';
        if (employee.status === 'Active') statusClass = 'success';
        if (employee.status === 'On Leave') statusClass = 'warning';
        if (employee.status === 'Terminated') statusClass = 'danger';
        
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.firstName} ${employee.lastName}</td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td><span class="badge bg-${statusClass}">${employee.status}</span></td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewEmployee(${employee.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="editEmployee(${employee.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEmployee(${employee.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Filter employees based on search input and filters
function filterEmployees() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const departmentValue = document.getElementById('departmentFilter')?.value || '';
    const statusValue = document.getElementById('statusFilter')?.value || '';
    
    const filteredEmployees = employees.filter(employee => {
        const nameMatch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchValue);
        const emailMatch = employee.email.toLowerCase().includes(searchValue);
        const departmentMatch = !departmentValue || employee.department === departmentValue;
        const statusMatch = !statusValue || employee.status === statusValue;
        
        return (nameMatch || emailMatch) && departmentMatch && statusMatch;
    });
    
    displayEmployees(filteredEmployees);
}

// Validate employee form
function validateEmployeeForm() {
    const form = document.getElementById('addEmployeeForm');
    const formErrorMessage = document.getElementById('formErrorMessage');
    
    form.classList.add('was-validated');
    
    if (form.checkValidity() === false) {
        formErrorMessage.classList.remove('d-none');
        return false;
    }
    
    // Validate email format
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        formErrorMessage.classList.remove('d-none');
        return false;
    }
    
    // Validate phone format
    const phoneInput = document.getElementById('phone');
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(phoneInput.value)) {
        phoneInput.classList.add('is-invalid');
        formErrorMessage.classList.remove('d-none');
        return false;
    }
    
    // Validate salary
    const salaryInput = document.getElementById('salary');
    if (isNaN(salaryInput.value) || Number(salaryInput.value) < 1000) {
        salaryInput.classList.add('is-invalid');
        formErrorMessage.classList.remove('d-none');
        return false;
    }
    
    formErrorMessage.classList.add('d-none');
    return true;
}

// Add a new employee
async function addEmployee() {
    if (!validateEmployeeForm()) {
        return;
    }
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const department = document.getElementById('department').value;
    const position = document.getElementById('position').value;
    const salary = Number(document.getElementById('salary').value);
    const status = document.getElementById('status').value;
    const joinDate = document.getElementById('joinDate').value;
    
    // Create new employee object
    const newEmployee = {
        id: employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1,
        firstName,
        lastName,
        email,
        phone,
        department,
        position,
        salary,
        status,
        joinDate
    };
    
    try {
        // Show loading state on button
        const saveButton = document.getElementById('saveEmployeeBtn');
        const originalButtonText = saveButton.innerHTML;
        saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
        saveButton.disabled = true;
        
        // Add to employees array
        employees.push(newEmployee);
        
        // Update department counts
        const existingDept = departments.find(dept => dept.name === department);
        if (existingDept) {
            existingDept.employeeCount += 1;
        }
        
        // Create updated data object
        const updatedData = {
            employees: employees,
            departments: departments,
            projects: projects
        };
        
        // Simulate network request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update UI
        // updateDashboardStats();
        populateDepartmentFilter();
        displayEmployees(employees);
        
        // Show success message
        const successMessage = document.getElementById('submitSuccess');
        successMessage.classList.remove('d-none');
        
        // Reset button
        saveButton.innerHTML = originalButtonText;
        saveButton.disabled = false;
        
        // Auto close after success
        setTimeout(() => {
            successMessage.classList.add('d-none');
            
            if (modal) {
                modal.hide();
            }
            
            document.getElementById('addEmployeeForm').classList.remove('was-validated');
            document.getElementById('addEmployeeForm').reset();
        }, 2000);
        
    } catch (error) {
        console.error('Error saving employee:', error);
        
        document.getElementById('formErrorMessage').textContent = 'Error saving employee. Please try again.';
        document.getElementById('formErrorMessage').classList.remove('d-none');
        
        const saveButton = document.getElementById('saveEmployeeBtn');
        saveButton.innerHTML = 'Save Employee';
        saveButton.disabled = false;
    }
}

// View employee details
function viewEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        alert(`Employee Details:\n\nName: ${employee.firstName} ${employee.lastName}\nEmail: ${employee.email}\nPhone: ${employee.phone}\nDepartment: ${employee.department}\nPosition: ${employee.position}\nSalary: $${employee.salary}\nStatus: ${employee.status}\nJoin Date: ${employee.joinDate}`);
    }
}

// Edit employee
function editEmployee(id) {
    alert(`Edit employee with ID: ${id}`);
}

// Delete employee
function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        const employeeToDelete = employees.find(emp => emp.id === id);
        if (!employeeToDelete) return;
        
        const dept = departments.find(d => d.name === employeeToDelete.department);
        if (dept && dept.employeeCount > 0) {
            dept.employeeCount -= 1;
        }
        
        employees = employees.filter(employee => employee.id !== id);
        
        // updateDashboardStats();
        displayEmployees(employees);
    }
}

// Event listeners for navbar search
document.addEventListener('DOMContentLoaded', function() {
    const navbarSearchButton = document.querySelector('.search-navbar button');
    const navbarSearchInput = document.getElementById('navbarSearchInput');
    
    if (navbarSearchButton && navbarSearchInput) {
        navbarSearchButton.addEventListener('click', function() {
            // Set the main search input value to match the navbar search input
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = navbarSearchInput.value;
                filterEmployees();
            }
        });
        
        // Allow search on Enter key press
        navbarSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = navbarSearchInput.value;
                    filterEmployees();
                }
            }
        });
    }
    
    // Initialize event listeners for filters if they exist
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterEmployees);
    }
    
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterEmployees);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterEmployees);
    }
    
    // Initialize save button
    const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
    if (saveEmployeeBtn) {
        saveEmployeeBtn.addEventListener('click', addEmployee);
    }
    
    // Initialize modal
    const modalElement = document.getElementById('addEmployeeModal');
    if (modalElement) {
        modal = new bootstrap.Modal(modalElement);
        
        modalElement.addEventListener('hidden.bs.modal', function () {
            const form = document.getElementById('addEmployeeForm');
            form.classList.remove('was-validated');
            form.reset();
            document.getElementById('formErrorMessage').classList.add('d-none');
            document.getElementById('submitSuccess').classList.add('d-none');
        });
    }
    
    // Load data
    loadData();
});