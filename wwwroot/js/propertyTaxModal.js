// Property Tax Category Modal Implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Property Tax Modal script loaded');
    
    // Check if we're on the property tax page
    const propertyTaxElements = document.getElementById('dynamicPropertyTaxCategoriesContainer');
    if (!propertyTaxElements) {
        console.log('Not on property tax page, skipping modal initialization');
        return; // Not on the property tax page, so exit early
    }
    
    console.log('Property tax page detected, initializing modal');
    
    // Find the "Add Category" button or form toggle
    const addCategoryForm = document.getElementById('addCategoryForm');
    const createBtn = document.getElementById('createPropertyTaxCategoryBtn');
    
    // Try to find any button that might show the add category form
    let showFormBtn = null;
    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
        if (btn.id && (btn.id.includes('add') || btn.id.includes('Add')) && 
            (btn.id.includes('Category') || btn.id.includes('category'))) {
            showFormBtn = btn;
            console.log('Found potential Add Category button:', btn.id);
            break;
        }
    }
    
    // If we found the inline form and the create button, we can enhance the functionality
    if (addCategoryForm && createBtn && showFormBtn) {
        console.log('Found all required elements for category creation');
        
        // Handle the show form button click
        showFormBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Show form button clicked');
            
            // Show the inline form
            addCategoryForm.style.display = 'block';
            
            // Focus on the input field
            const nameInput = document.getElementById('newPropertyTaxCategoryNameCreate');
            if (nameInput) {
                nameInput.focus();
            }
        });
        
        // Handle the create button click
        createBtn.addEventListener('click', function() {
            console.log('Create button clicked');
            
            // Get the category name
            const nameInput = document.getElementById('newPropertyTaxCategoryNameCreate');
            if (!nameInput) {
                console.error('Category name input not found');
                return;
            }
            
            const categoryName = nameInput.value.trim();
            if (!categoryName) {
                alert('Please enter a category name');
                return;
            }
            
            console.log('Creating new category:', categoryName);
            
            // Get the template
            const template = document.getElementById('propertyTaxCategoryTemplate');
            if (!template) {
                console.error('Category template not found');
                return;
            }
            
            // Clone the template
            const newCategory = template.cloneNode(true);
            newCategory.id = 'category-' + categoryName.replace(/\\s+/g, '-');
            newCategory.style.display = 'block';
            
            // Update the category name in the template
            const categoryTitle = newCategory.querySelector('.category-title');
            if (categoryTitle) {
                categoryTitle.textContent = categoryName;
            }
            
            // Update any IDs or data attributes that need to be unique
            const collapseId = 'category' + categoryName.replace(/\\s+/g, '') + 'Collapse';
            const cardHeader = newCategory.querySelector('.card-header');
            if (cardHeader) {
                cardHeader.setAttribute('data-bs-target', '#' + collapseId);
                cardHeader.setAttribute('aria-controls', collapseId);
            }
            
            const collapseDiv = newCategory.querySelector('.collapse');
            if (collapseDiv) {
                collapseDiv.id = collapseId;
            }
            
            // Add the new category to the container
            const container = document.getElementById('dynamicPropertyTaxCategoriesContainer');
            if (container) {
                container.appendChild(newCategory);
                
                // Hide the form
                addCategoryForm.style.display = 'none';
                
                // Clear the input
                nameInput.value = '';
                
                console.log('New category added:', categoryName);
                
                // Recalculate property tax revenue if the function exists
                if (typeof calculatePropertyTaxRevenue === 'function') {
                    calculatePropertyTaxRevenue();
                }
            } else {
                console.error('Dynamic categories container not found');
            }
        });
        
        // Add cancel button functionality if it exists
        const cancelBtn = document.getElementById('cancelAddCategoryBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                // Hide the form
                addCategoryForm.style.display = 'none';
                
                // Clear the input
                const nameInput = document.getElementById('newPropertyTaxCategoryNameCreate');
                if (nameInput) {
                    nameInput.value = '';
                }
            });
        }
    } else {
        console.log('Could not find all required elements for category creation');
    }
});
