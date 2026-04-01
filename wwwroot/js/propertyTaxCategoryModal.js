// Property Tax Category Modal Implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Property Tax Category Modal script loaded');
    
    // Check if we're on the property tax page
    const propertyTaxTab = document.getElementById('property-tax-tab');
    if (!propertyTaxTab || propertyTaxTab.style.display === 'none') {
        console.log('Not on property tax tab, skipping modal initialization');
        return;
    }
    
    console.log('Property tax tab detected, initializing modal');
    
    // Find the "Add Category" button
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (!addCategoryBtn) {
        console.log('Add Category button not found');
        return;
    }
    
    // Find the inline form
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (!addCategoryForm) {
        console.log('Add Category form not found');
        return;
    }
    
    // Create a modal for adding categories
    const modalHTML = `
    <div class="modal fade" id="addPropertyTaxCategoryModal" tabindex="-1" aria-labelledby="addPropertyTaxCategoryModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addPropertyTaxCategoryModalLabel">Add New Category</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="newPropertyTaxCategoryNameModalInput" class="form-label">Category Name</label>
                        <input type="text" class="form-control" id="newPropertyTaxCategoryNameModalInput" placeholder="Enter category name" required>
                        <div class="invalid-feedback">
                            Please enter a category name.
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmAddPropertyTaxCategoryBtn">Create Category</button>
                </div>
            </div>
        </div>
    </div>`;
    
    // Create a container for the modal and append it to the body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Modify the "Add Category" button to show the modal instead of the inline form
    addCategoryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Add Category button clicked');
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('addPropertyTaxCategoryModal'));
        modal.show();
    });
    
    // Handle the "Create Category" button in the modal
    const confirmBtn = document.getElementById('confirmAddPropertyTaxCategoryBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const categoryNameInput = document.getElementById('newPropertyTaxCategoryNameModalInput');
            const categoryName = categoryNameInput.value.trim();
            
            if (!categoryName) {
                categoryNameInput.classList.add('is-invalid');
                return;
            }
            
            categoryNameInput.classList.remove('is-invalid');
            
            // Hide the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPropertyTaxCategoryModal'));
            modal.hide();
            
            // Set the value in the original input field
            const originalInput = document.getElementById('newPropertyTaxCategoryNameCreate');
            if (originalInput) {
                originalInput.value = categoryName;
                
                // Show the inline form
                addCategoryForm.style.display = 'block';
                
                // Trigger a click on the original create button
                const createBtn = document.getElementById('createPropertyTaxCategoryBtn');
                if (createBtn) {
                    setTimeout(() => {
                        createBtn.click();
                    }, 100);
                }
            }
        });
    }
});
