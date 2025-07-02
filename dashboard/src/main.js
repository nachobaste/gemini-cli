document.addEventListener('DOMContentLoaded', () => {
    const kanbanBoard = document.getElementById('kanban-board');
    const quickAddButton = document.getElementById('quick-add-button');
    const quickAddModal = document.getElementById('quick-add-modal');
    const cancelAddButton = document.getElementById('cancel-add');
    const quickAddForm = document.getElementById('quick-add-form');
    const detailModal = document.getElementById('detail-modal');
    const closeDetailModalButton = document.getElementById('close-detail-modal');
    const commentsSection = document.getElementById('comments-section');
    const newCommentInput = document.getElementById('new-comment');
    const postCommentButton = document.getElementById('post-comment');
    const assignTeamMemberSelect = document.getElementById('assign-team-member');

    let opportunities = [
        // Sample Data
        {
            id: '1',
            name: 'San Salvador Mixed-Use',
            assetClass: 'Mixed-Use',
            country: 'El Salvador',
            geocuboScore: 8.2,
            assignedTo: 'Alice',
            status: 'new-opportunities',
            comments: []
        },
        {
            id: '2',
            name: 'Santa Ana Residential',
            assetClass: 'Residential',
            country: 'El Salvador',
            geocuboScore: 6.5,
            assignedTo: 'Bob',
            status: 'initial-screening',
            comments: []
        },
        {
            id: '3',
            name: 'Panama City Commercial',
            assetClass: 'Commercial',
            country: 'Panama',
            geocuboScore: 5.8,
            assignedTo: 'Alice',
            status: 'detailed-analysis',
            comments: []
        },
        {
            id: '4',
            name: 'Bogota Office Park',
            assetClass: 'Office',
            country: 'Colombia',
            geocuboScore: 7.1,
            assignedTo: 'Charlie',
            status: 'due-diligence',
            comments: []
        }
    ];

    const teamMembers = ['Alice', 'Bob', 'Charlie', 'David'];

    // Render Opportunities
    function renderOpportunities() {
        document.querySelectorAll('.kanban-cards').forEach(container => container.innerHTML = '');
        opportunities.forEach(opportunity => {
            const card = createOpportunityCard(opportunity);
            document.querySelector(`.kanban-column[data-status="${opportunity.status}"] .kanban-cards`).appendChild(card);
        });
        populateFilters();
    }

    function createOpportunityCard(opportunity) {
        const card = document.createElement('div');
        card.className = 'kanban-card bg-white p-4 rounded-lg shadow-md cursor-grab';
        card.setAttribute('draggable', 'true');
        card.dataset.id = opportunity.id;

        let scoreColorClass;
        if (opportunity.geocuboScore > 7.5) {
            scoreColorClass = 'bg-green-500';
        } else if (opportunity.geocuboScore >= 6.0) {
            scoreColorClass = 'bg-yellow-500';
        } else {
            scoreColorClass = 'bg-red-500';
        }

        card.innerHTML = `
            <h3 class="font-semibold text-lg mb-1">${opportunity.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${opportunity.assetClass} | ${opportunity.country}</p>
            <div class="flex items-center justify-between">
                <div class="w-8 h-8 rounded-full ${scoreColorClass} flex items-center justify-center text-white font-bold text-sm">${opportunity.geocuboScore.toFixed(1)}</div>
                <div class="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm">${opportunity.assignedTo.charAt(0)}</div>
            </div>
        `;

        card.addEventListener('click', () => openDetailModal(opportunity));
        return card;
    }

    // Drag and Drop
    let draggedItem = null;

    kanbanBoard.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('kanban-card')) {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.classList.add('hidden');
            }, 0);
        }
    });

    kanbanBoard.addEventListener('dragend', (e) => {
        if (draggedItem) {
            draggedItem.classList.remove('hidden');
            draggedItem = null;
        }
    });

    kanbanBoard.addEventListener('dragover', (e) => {
        e.preventDefault();
        const targetColumn = e.target.closest('.kanban-column');
        if (targetColumn) {
            const kanbanCards = targetColumn.querySelector('.kanban-cards');
            if (kanbanCards) {
                const afterElement = getDragAfterElement(kanbanCards, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    kanbanCards.appendChild(draggedItem);
                } else {
                    kanbanCards.insertBefore(draggedItem, afterElement);
                }
            }
        }
    });

    kanbanBoard.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetColumn = e.target.closest('.kanban-column');
        if (targetColumn && draggedItem) {
            const newStatus = targetColumn.dataset.status;
            const opportunityId = draggedItem.dataset.id;
            const opportunityIndex = opportunities.findIndex(opp => opp.id === opportunityId);
            if (opportunityIndex > -1) {
                opportunities[opportunityIndex].status = newStatus;
                renderOpportunities(); // Re-render to reflect status change and re-apply filters
            }
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.kanban-card:not(.hidden)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: -Infinity }).element;
    }

    // Quick Add Modal
    quickAddButton.addEventListener('click', () => {
        quickAddModal.classList.remove('hidden');
        quickAddModal.classList.add('flex');
    });

    cancelAddButton.addEventListener('click', () => {
        quickAddModal.classList.add('hidden');
        quickAddModal.classList.remove('flex');
        quickAddForm.reset();
    });

    quickAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectName = document.getElementById('project-name').value;
        const projectLocation = document.getElementById('project-location').value;
        const projectSize = parseFloat(document.getElementById('project-size').value);

        // Simple score generation for demo purposes
        const geocuboScore = Math.random() * 10; 

        const newOpportunity = {
            id: String(opportunities.length + 1),
            name: projectName,
            assetClass: 'Unknown',
            country: projectLocation, // Using location as country for simplicity
            geocuboScore: geocuboScore,
            assignedTo: 'Unassigned',
            status: 'new-opportunities',
            comments: []
        };
        opportunities.push(newOpportunity);
        renderOpportunities();
        cancelAddButton.click(); // Close modal and reset form
    });

    // Detailed View Modal
    let currentOpportunity = null;

    function openDetailModal(opportunity) {
        currentOpportunity = opportunity;
        document.getElementById('detail-project-name').textContent = opportunity.name;
        document.getElementById('detail-asset-country').textContent = `${opportunity.assetClass} | ${opportunity.country}`;
        document.getElementById('detail-geocubo-score').textContent = `GEOCUBO Score: ${opportunity.geocuboScore.toFixed(1)}`;
        
        // Populate team members dropdown
        assignTeamMemberSelect.innerHTML = '';
        teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            if (member === opportunity.assignedTo) {
                option.selected = true;
            }
            assignTeamMemberSelect.appendChild(option);
        });

        // Display comments
        renderComments(opportunity.comments);

        detailModal.classList.remove('hidden');
        detailModal.classList.add('flex');
    }

    closeDetailModalButton.addEventListener('click', () => {
        detailModal.classList.add('hidden');
        detailModal.classList.remove('flex');
        currentOpportunity = null;
        newCommentInput.value = '';
    });

    postCommentButton.addEventListener('click', () => {
        if (currentOpportunity) {
            const commentText = newCommentInput.value.trim();
            if (commentText) {
                const newComment = {
                    author: 'Current User', // Placeholder
                    text: commentText,
                    timestamp: new Date().toLocaleString()
                };
                currentOpportunity.comments.push(newComment);
                renderComments(currentOpportunity.comments);
                newCommentInput.value = '';
            }
        }
    });

    assignTeamMemberSelect.addEventListener('change', (e) => {
        if (currentOpportunity) {
            currentOpportunity.assignedTo = e.target.value;
            renderOpportunities(); // Re-render to update assigned team member on card
        }
    });

    function renderComments(comments) {
        commentsSection.innerHTML = '';
        if (comments.length === 0) {
            commentsSection.innerHTML = '<p class="text-gray-500">No comments yet.</p>';
            return;
        }
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'mb-2 p-2 bg-gray-100 rounded-md';
            commentDiv.innerHTML = `
                <p class="font-semibold text-sm">${comment.author} <span class="text-gray-500 text-xs">${comment.timestamp}</span></p>
                <p class="text-gray-800">${comment.text}</p>
            `;
            commentsSection.appendChild(commentDiv);
        });
        commentsSection.scrollTop = commentsSection.scrollHeight; // Scroll to bottom
    }

    // Filtering
    const countryFilter = document.getElementById('country-filter');
    const assetClassFilter = document.getElementById('asset-class-filter');
    const teamMemberFilter = document.getElementById('team-member-filter');

    function populateFilters() {
        const countries = [...new Set(opportunities.map(opp => opp.country))];
        const assetClasses = [...new Set(opportunities.map(opp => opp.assetClass))];

        countryFilter.innerHTML = '<option value="all">All Countries</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });

        assetClassFilter.innerHTML = '<option value="all">All Asset Classes</option>';
        assetClasses.forEach(assetClass => {
            const option = document.createElement('option');
            option.value = assetClass;
            option.textContent = assetClass;
            assetClassFilter.appendChild(option);
        });

        teamMemberFilter.innerHTML = '<option value="all">All Team Members</option>';
        teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            teamMemberFilter.appendChild(option);
        });
    }

    [countryFilter, assetClassFilter, teamMemberFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    function applyFilters() {
        const selectedCountry = countryFilter.value;
        const selectedAssetClass = assetClassFilter.value;
        const selectedTeamMember = teamMemberFilter.value;

        document.querySelectorAll('.kanban-card').forEach(card => {
            const opportunityId = card.dataset.id;
            const opportunity = opportunities.find(opp => opp.id === opportunityId);

            const matchesCountry = selectedCountry === 'all' || opportunity.country === selectedCountry;
            const matchesAssetClass = selectedAssetClass === 'all' || opportunity.assetClass === selectedAssetClass;
            const matchesTeamMember = selectedTeamMember === 'all' || opportunity.assignedTo === selectedTeamMember;

            if (matchesCountry && matchesAssetClass && matchesTeamMember) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Initial render
    renderOpportunities();
});
