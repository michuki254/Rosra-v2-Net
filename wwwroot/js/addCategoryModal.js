// Add Category Modal Implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Add Category Modal script loaded');
    
    // Check if we're on the property tax page by looking for key elements
    const propertyTaxElements = document.getElementById('dynamicPropertyTaxCategoriesContainer');
    if (!propertyTaxElements) {
        console.log('Not on property tax page, skipping modal initialization');
        return; // Not on the property tax page, so exit early
    }
    
    console.log('Property tax page detected, initializing modal');
    
    // First, inject the modal HTML into the page
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

    // Look for the button that shows the inline form
    // We need to be more specific to find the right button
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const showAddCategoryFormBtn = document.getElementById('showAddCategoryFormBtn');
    
    // Find the inline form element
    const addCategoryForm = document.getElementById('addCategoryForm');
    
    // If we found a button that shows the inline form
    let targetBtn = null;
    if (addCategoryBtn) {
        targetBtn = addCategoryBtn;
        console.log('Found Add Category button:', targetBtn.id);
    } else if (showAddCategoryFormBtn) {
        targetBtn = showAddCategoryFormBtn;
        console.log('Found Show Add Category Form button:', targetBtn.id);
    } else {
        // Try to find any button that might be related to adding categories
        const possibleButtons = document.querySelectorAll('button');
        for (const btn of possibleButtons) {
            if (btn.textContent.toLowerCase().includes('add') && 
                btn.textContent.toLowerCase().includes('category')) {
                targetBtn = btn;
                console.log('Found potential Add Category button:', btn.textContent);
                break;
            }
        }
    }
    
    if (targetBtn) {
        // Replace the original click handler with our modal handler
        // First, clone the button to remove any existing event listeners
        const newBtn = targetBtn.cloneNode(true);
        targetBtn.parentNode.replaceChild(newBtn, targetBtn);
        
        // Add our event listener to show the modal
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear the input field
            const modalInputElement = document.getElementById('newPropertyTaxCategoryNameModalInput');
            if (modalInputElement) {
                modalInputElement.value = '';
                modalInputElement.classList.remove('is-invalid');
                const feedbackElement = modalInputElement.nextElementSibling;
                if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                    feedbackElement.textContent = 'Please enter a category name.';
                }
            }
            
            // Show the modal
            const addCategoryModal = new bootstrap.Modal(document.getElementById('addPropertyTaxCategoryModal'));
            addCategoryModal.show();
        });
    }
    
    // Add event listener for the "Create Category" button in the modal
    const confirmBtn = document.getElementById('confirmAddPropertyTaxCategoryBtn');
    if (confirmBtn) {
        console.log('Found Create Category button in modal');
        confirmBtn.addEventListener('click', function() {
            const categoryNameInput = document.getElementById('newPropertyTaxCategoryNameModalInput');
            const categoryName = categoryNameInput.value.trim();
            
            // Validate the input
            if (!categoryName) {
                categoryNameInput.classList.add('is-invalid');
                return;
            } else {
                categoryNameInput.classList.remove('is-invalid');
            }
            
            // Check for duplicate category names
            const existingCategories = document.querySelectorAll('.category-title');
            let isDuplicate = false;
            existingCategories.forEach(function(titleEl) {
                if (titleEl.textContent.trim().toLowerCase() === categoryName.toLowerCase()) {
                    isDuplicate = true;
                }
            });
            
            if (isDuplicate) {
                categoryNameInput.classList.add('is-invalid');
                const feedbackElement = categoryNameInput.nextElementSibling;
                if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                    feedbackElement.textContent = 'This category name already exists.';
                }
                return;
            }
            
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
                
                // Check if there's an existing createPropertyTaxCategoryBtn function
                // If so, we'll use that to maintain compatibility with existing code
                const createBtn = document.getElementById('createPropertyTaxCategoryBtn');
                
                if (createBtn) {
                    console.log('Using existing category creation functionality');
                    // Set the value in the original input field
                    const originalInput = document.getElementById('newPropertyTaxCategoryNameCreate');
                    if (originalInput) {
                        originalInput.value = categoryName;
                        
                        // Trigger a click on the original create button
                        createBtn.click();
                        return;
            // Add event listeners for rename and delete buttons
            const renameBtn = newCategory.querySelector('.rename-category-btn');
            if (renameBtn) {
                renameBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    currentPropertyTaxCategory = this.closest('.category-card');
                    document.getElementById('currentPropertyTaxCategoryName').value = currentPropertyTaxCategory.querySelector('.category-title').textContent;
                    document.getElementById('newPropertyTaxCategoryName').value = '';
                    var renameModal = new bootstrap.Modal(document.getElementById('renamePropertyTaxCategoryModal'));
                    renameModal.show();
                });
            }
            
            const deleteBtn = newCategory.querySelector('.remove-category-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var card = this.closest('.category-card');
                    if (card) {
                        var catName = card.querySelector('.category-title').textContent;
                        document.getElementById('deleteCategoryName').textContent = catName;
                        document.getElementById('categoryToDeleteId').value = card.id;
                        var deleteModal = new bootstrap.Modal(document.getElementById('deletePropertyTaxCategoryModal'));
                        deleteModal.show();
                    }
                });
            }
            
            // Add the new category to the container
            const container = document.getElementById('dynamicPropertyTaxCategoriesContainer');
            if (container) {
                container.appendChild(newCategory);
            } else {
                console.error('Dynamic categories container not found!');
                alert('Error: Could not find where to add the new category.');
                return;
            }
            
            // Recalculate property tax revenue
            if (typeof calculatePropertyTaxRevenue === 'function') {
                calculatePropertyTaxRevenue();
            }
            
            // Close the modal
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('addPropertyTaxCategoryModal'));
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
});
