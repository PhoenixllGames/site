// guides.js

document.addEventListener('DOMContentLoaded', () => {
    const guidesContent = document.getElementById('guides-content');
    guidesContent.innerHTML = '<div class="loading-spinner"></div>';

    const guideName = window.location.hash.substring(1);

    if (!guideName) {
        guidesContent.innerHTML = '<p>Гайд не найден.</p>';
        return;
    }

    fetch(`https://website.jshsh6.workers.dev/${guideName}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length === 1 && Array.isArray(data[0]) && data[0].length === 1) {
                data = data[0][0];
            } else {
                throw new Error('Invalid data format');
            }

            guidesContent.innerHTML = '';

            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('guide-section');

            const title = document.createElement('h2');
            title.textContent = data.title || 'Гайд';
            sectionDiv.appendChild(title);

            if (data.Actual) {
                const actualStatus = document.createElement('div');
                actualStatus.classList.add('guide-actual-status');
                if (data.Actual.toLowerCase() === 'true') {
                    actualStatus.textContent = 'Актуальный гайд';
                    actualStatus.classList.add('actual');
                } else {
                    actualStatus.textContent = 'Неактуальный гайд (может быть устаревшим)';
                    actualStatus.classList.add('not-actual');
                }
                sectionDiv.appendChild(actualStatus);
            }

            const groups = {
                'Runes': Object.keys(data).filter(k => k.match(/^runes\d*$/)).sort((a, b) => {
                    const numA = parseInt(a.match(/\d+$/)?.[0] || '0');
                    const numB = parseInt(b.match(/\d+$/)?.[0] || '0');
                    return numA - numB;
                }),
                'Skills': Object.keys(data).filter(k => k === 'skills'),
                'Skill-order': Object.keys(data).filter(k => k.match(/^skill-order\d*$/)).sort((a, b) => {
                    const numA = parseInt(a.match(/\d+$/)?.[0] || '0');
                    const numB = parseInt(b.match(/\d+$/)?.[0] || '0');
                    return numA - numB;
                }),
                'Items-order': Object.keys(data).filter(k => k.match(/^items-order\d*$/)).sort((a, b) => {
                    const numA = parseInt(a.match(/\d+$/)?.[0] || '0');
                    const numB = parseInt(b.match(/\d+$/)?.[0] || '0');
                    return numA - numB;
                })
            };

            const groupOrder = ['Runes', 'Skills', 'Skill-order', 'Items-order'];
            const groupNames = ['Руны', 'Скилы', 'Порядок cкилов', 'Порядок предметов'];

            groupOrder.forEach(groupName => {
                const keys = groups[groupName];
                if (keys.length === 0) return;

                keys.forEach((category, index) => {
                    if (data[category] && Array.isArray(data[category])) {
                        const subSection = document.createElement('div');
                        subSection.classList.add('guide-subsection');

                        const subTitle = document.createElement('h3');
                        let titleText = groupNames[groupOrder.indexOf(groupName)];
                        if (keys.length > 1) {
                            titleText += ` ${index + 1}`;
                        }
                        subTitle.textContent = titleText;
                        subSection.appendChild(subTitle);

                        data[category].forEach(item => {
                            if (groupName === 'Skills') {
                                const skillsGrid = document.createElement('div');
                                skillsGrid.classList.add('skills-grid');

                                let i = 1;
                                while (true) {
                                    const pngKey = `skill-png${i}`;
                                    const textKey = `skill-text${i}`;
                                    if (!item[pngKey] || !item[textKey]) break;

                                    const skillItem = document.createElement('div');
                                    skillItem.classList.add('skill-item');

                                    const img = document.createElement('img');
                                    img.src = item[pngKey].trim();
                                    img.alt = 'Skill Image';
                                    img.classList.add('skill-image');
                                    skillItem.appendChild(img);

                                    if (item[`skill-label${i}`]) {
                                        const label = document.createElement('div');
                                        label.textContent = item[`skill-label${i}`].trim();
                                        label.classList.add('skill-label');
                                        skillItem.appendChild(label);
                                    }

                                    const text = document.createElement('p');
                                    let textValue = item[textKey].trim();
                                    if (textValue.includes('-')) {
                                        textValue = textValue.split(' -').join('<br>');
                                    }
                                    text.innerHTML = textValue;
                                    text.classList.add('skill-text');
                                    skillItem.appendChild(text);

                                    skillsGrid.appendChild(skillItem);
                                    i++;
                                }

                                // Add hover effect listeners
                                const skillItems = skillsGrid.querySelectorAll('.skill-item');
                                skillItems.forEach((skillItem, idx) => {
                                    skillItem.addEventListener('mouseenter', () => {
                                        skillItem.classList.add('hovered');
                                        if (idx > 0) {
                                            skillItems[idx - 1].classList.add('adjacent-left');
                                        }
                                        if (idx < skillItems.length - 1) {
                                            skillItems[idx + 1].classList.add('adjacent-right');
                                        }
                                    });

                                    skillItem.addEventListener('mouseleave', () => {
                                        skillItem.classList.remove('hovered');
                                        if (idx > 0) {
                                            skillItems[idx - 1].classList.remove('adjacent-left');
                                        }
                                        if (idx < skillItems.length - 1) {
                                            skillItems[idx + 1].classList.remove('adjacent-right');
                                        }
                                    });
                                });

                                subSection.appendChild(skillsGrid);
                            } else {
                                // Standard item: label, picture left, text right
                                const guideItem = document.createElement('div');
                                guideItem.classList.add('guide-item');

                                if (item.picture) {
                                    const img = document.createElement('img');
                                    img.src = item.picture.trim();
                                    img.alt = 'Guide Image';
                                    img.classList.add('guide-image');
                                    guideItem.appendChild(img);
                                }

                                const contentDiv = document.createElement('div');
                                contentDiv.classList.add('guide-content');

                                if (item.label) {
                                    const label = document.createElement('div');
                                    label.textContent = item.label.trim();
                                    label.classList.add('guide-label');
                                    contentDiv.appendChild(label);
                                }

                                if (item.text) {
                                    const p = document.createElement('p');
                                    let textValue = item.text.trim();
                                    if (textValue.includes('-')) {
                                        textValue = textValue.split(' -').join('<br>');
                                    }
                                    p.innerHTML = textValue;
                                    p.classList.add('guide-text');
                                    contentDiv.appendChild(p);
                                }

                                guideItem.appendChild(contentDiv);
                                subSection.appendChild(guideItem);
                            }
                        });

                        sectionDiv.appendChild(subSection);
                    }
                });
            });

            if (data['video-guide']) {
                const wrapper = document.createElement('div');
                wrapper.classList.add('guide-video-wrapper');

                const iframe = document.createElement('iframe');
                const videoId = data['video-guide'].split('v=')[1] || data['video-guide'].split('/').pop();
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                iframe.classList.add('guide-video');
                iframe.allowFullscreen = true;

                wrapper.appendChild(iframe);
                sectionDiv.appendChild(wrapper);
            }

            guidesContent.appendChild(sectionDiv);
        })
        .catch(error => {
            console.error('Error fetching guide:', error);
            guidesContent.innerHTML = '<p>Ошибка загрузки гайда.</p>';
        });
});