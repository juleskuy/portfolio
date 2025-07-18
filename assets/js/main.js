(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox',
    openEffect: 'zoom', /* Use zoom effect when opening the lightbox */
    closeEffect: 'zoom', /* Use zoom effect when closing the lightbox */
    slideEffect: 'slide', /* Use slide effect when changing slides */
    loop: true, /* Enable continuous loop for gallery */
    autoplayVideos: true, /* Autoplay videos when opened */
    descPosition: 'bottom', /* Position description at the bottom */
    zoomable: false, /* Disable zoom functionality for images */
    draggable: true /* Enable drag functionality for images */
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // Add html2pdf.js CDN if not present
  if (!document.querySelector('script[src*="html2pdf"]')) {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    document.head.appendChild(script);
  }

  // Wait for DOM and html2pdf to be ready
  function onHtml2PdfReady(callback) {
    if (typeof html2pdf !== 'undefined') {
      callback();
    } else {
      setTimeout(function() { onHtml2PdfReady(callback); }, 100);
    }
  }

  /**
   * Wait for PDF libraries to be ready
   */
  function waitForPDFLibraries(callback, maxAttempts = 100, currentAttempt = 0) {
    if (typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined') {
      callback();
    } else if (currentAttempt < maxAttempts) {
      setTimeout(function() {
        waitForPDFLibraries(callback, maxAttempts, currentAttempt + 1);
      }, 100);
    } else {
      console.error('PDF libraries failed to load after maximum attempts');
      // Reset button state
      const btn = document.getElementById('download-resume');
      if (btn) {
        btn.textContent = 'Download Resume (PDF)';
        btn.disabled = false;
      }
      alert('Failed to load PDF libraries. Please refresh the page and try again.');
    }
  }

  /**
   * PDF Generation
   */
  function setupTemporaryContainerAndStyling() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '800px';
    container.style.fontFamily = "'Poppins', sans-serif";
    return container;
  }

  function cloneAndPrepareContentSections(container) {
    // Header
    const header = document.createElement('div');
    header.style.background = '#6f42c1';
    header.style.color = 'white';
    header.style.padding = '40px';
    header.style.textAlign = 'center';
    header.style.marginBottom = '30px';

    const name = document.createElement('h1');
    name.textContent = 'Zulfan Nurrahman';
    name.style.fontSize = '32px';
    name.style.marginBottom = '10px';
    name.style.color = 'white';

    const title = document.createElement('div');
    title.textContent = 'Full-Stack Web Developer & Social Media Specialist';
    title.style.fontSize = '18px';
    title.style.marginBottom = '20px';
    title.style.color = 'rgba(255, 255, 255, 0.9)';

    const contactInfo = document.createElement('div');
    contactInfo.style.display = 'flex';
    contactInfo.style.justifyContent = 'center';
    contactInfo.style.gap = '20px';
    contactInfo.style.fontSize = '14px';
    contactInfo.style.color = 'rgba(255, 255, 255, 0.9)';
    contactInfo.innerHTML = `
      <div>📍 Bandung, Indonesia</div>
      <div>📧 zulfann2299@gmail.com</div>
      <div>📱 +62 812-2217-9661</div>
      <div>🌐 juleskuy.netlify.app</div>
    `;
    header.appendChild(name);
    header.appendChild(title);
    header.appendChild(contactInfo);
    container.appendChild(header);

    // Resume Section
    const resumeSection = document.getElementById('resume-content').cloneNode(true);
    const contentWrapper = document.createElement('div');
    contentWrapper.style.padding = '0 40px';
    contentWrapper.style.background = 'white';
    resumeSection.style.color = '#2c3e50';
    resumeSection.style.marginBottom = '40px';

    // Modify summary section
    const summaryTitle = resumeSection.querySelector('.resume-title');
    if (summaryTitle && summaryTitle.textContent === 'Summary') {
      summaryTitle.textContent = 'About';
    }
    const originalSummary = resumeSection.querySelector('.resume-item.pb-0');
    if (originalSummary) {
      const nameHeading = originalSummary.querySelector('h4');
      const contactList = originalSummary.querySelector('ul');
      if (nameHeading) nameHeading.remove();
      if (contactList) contactList.remove();
      originalSummary.style.marginTop = '20px';
      originalSummary.style.marginBottom = '40px';
      originalSummary.style.color = '#2c3e50';
      const summaryContent = originalSummary.querySelector('em');
      if (summaryContent) {
        const newParagraph = document.createElement('p');
        newParagraph.textContent = summaryContent.textContent;
        newParagraph.style.color = '#2c3e50';
        newParagraph.style.fontSize = '16px';
        newParagraph.style.lineHeight = '1.6';
        newParagraph.style.margin = '0';
        summaryContent.parentNode.replaceChild(newParagraph, summaryContent);
      }
    }
    resumeSection.querySelectorAll('.resume-title').forEach(title => {
      title.style.color = '#6f42c1';
      title.style.fontSize = '24px';
      title.style.marginBottom = '20px';
      title.style.borderBottom = '2px solid #6f42c1';
      title.style.paddingBottom = '10px';
    });
    resumeSection.querySelectorAll('.resume-item').forEach(item => {
      const h4 = item.querySelector('h4');
      if (h4 && h4.textContent === 'Social Media Specialist') {
        item.style.pageBreakBefore = 'always';
        item.style.marginTop = '80px';
        item.style.borderLeft = '2px solid #6f42c1';
        item.style.paddingLeft = '20px';
      } else {
        item.style.borderLeft = '2px solid #6f42c1';
        item.style.paddingLeft = '20px';
      }
      item.style.marginBottom = '35px';
      if (h4) {
        h4.style.color = '#2c3e50';
        h4.style.fontSize = '18px';
        h4.style.marginBottom = '5px';
      }
      const h5 = item.querySelector('h5');
      if (h5) {
        h5.style.color = '#6f42c1';
        h5.style.fontSize = '14px';
        h5.style.marginBottom = '10px';
      }
      const em = item.querySelector('em');
      if (em) {
        em.style.color = '#7f8c8d';
        em.style.fontStyle = 'italic';
      }
    });

    // Skills Section
    const skillsWrapper = document.createElement('div');
    skillsWrapper.style.marginTop = '40px';
    skillsWrapper.style.marginBottom = '40px';
    const skillsTitle = document.createElement('h2');
    skillsTitle.textContent = 'Technical Skills';
    skillsTitle.style.color = '#6f42c1';
    skillsTitle.style.fontSize = '24px';
    skillsTitle.style.marginBottom = '30px';
    skillsTitle.style.borderBottom = '2px solid #6f42c1';
    skillsTitle.style.paddingBottom = '10px';
    skillsWrapper.appendChild(skillsTitle);
    const skillCategories = {
      'Front-End Development': [
        'JavaScript (ES6+)', 'TypeScript', 'React', 'HTML5 & CSS3', 'Bootstrap', 'Tailwind CSS'
      ],
      'Back-End Development': [
        'Laravel', 'PHP', 'REST API', 'MySQL', 'Node.js', 'MariaDB'
      ],
      'Tools & Others': [
        'Git & GitHub', 'VS Code', 'npm/yarn', 'Agile/Scrum', 'CI/CD'
      ]
    };
    const skillsGrid = document.createElement('div');
    skillsGrid.style.display = 'grid';
    skillsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    skillsGrid.style.gap = '30px';
    skillsGrid.style.marginTop = '20px';
    Object.entries(skillCategories).forEach(([category, skills]) => {
      const categoryDiv = document.createElement('div');
      const categoryTitle = document.createElement('h3');
      categoryTitle.textContent = category;
      categoryTitle.style.color = '#2c3e50';
      categoryTitle.style.fontSize = '18px';
      categoryTitle.style.marginBottom = '15px';
      categoryTitle.style.fontWeight = '600';
      categoryDiv.appendChild(categoryTitle);
      const skillsList = document.createElement('ul');
      skillsList.style.listStyle = 'none';
      skillsList.style.padding = '0';
      skillsList.style.margin = '0';
      skills.forEach(skill => {
        const skillItem = document.createElement('li');
        skillItem.style.marginBottom = '10px';
        skillItem.style.color = '#4a5568';
        skillItem.style.fontSize = '14px';
        skillItem.style.display = 'flex';
        skillItem.style.alignItems = 'center';
        const bullet = document.createElement('span');
        bullet.textContent = '•';
        bullet.style.color = '#6f42c1';
        bullet.style.marginRight = '8px';
        bullet.style.fontSize = '16px';
        skillItem.appendChild(bullet);
        const skillText = document.createElement('span');
        skillText.textContent = skill;
        skillItem.appendChild(skillText);
        skillsList.appendChild(skillItem);
      });
      categoryDiv.appendChild(skillsList);
      skillsGrid.appendChild(categoryDiv);
    });
    skillsWrapper.appendChild(skillsGrid);
    [resumeSection, skillsWrapper].forEach(section => {
      section.querySelectorAll && section.querySelectorAll('[data-aos]').forEach(el => {
        el.removeAttribute('data-aos');
        el.removeAttribute('data-aos-delay');
      });
    });
    contentWrapper.appendChild(resumeSection);
    contentWrapper.appendChild(skillsWrapper);
    container.appendChild(contentWrapper);
    // Footer
    const footer = document.createElement('div');
    footer.style.borderTop = '2px solid #e9ecef';
    footer.style.marginTop = '40px';
    footer.style.paddingTop = '20px';
    footer.style.paddingBottom = '20px';
    footer.style.textAlign = 'center';
    footer.style.color = '#7f8c8d';
    footer.style.fontSize = '12px';
    footer.innerHTML = `
      <div style="margin-bottom: 10px; color: #2c3e50;">
        <span style="margin: 0 10px;">GitHub: github.com/juleskuy</span>
        <span style="margin: 0 10px;">LinkedIn: linkedin.com/in/juleskuy</span>
        <span style="margin: 0 10px;">Instagram: instagram.com/zulfann22</span>
      </div>
      <div>Last updated: ${new Date().toLocaleDateString()}</div>
    `;
    container.appendChild(footer);
    return container;
  }

  async function generateCanvasAndPDF(container) {
    document.body.appendChild(container);
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 800,
      scrollY: -window.scrollY,
      onclone: (clonedDoc) => {
        const content = clonedDoc.querySelector('#resume-content');
        if (content) content.style.transform = 'none';
      }
    });
    document.body.removeChild(container);
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save('Jule_Resume.pdf');
  }

  function handlePDFGenerationErrorAndUIState(error, btn) {
    console.error('PDF generation failed:', error);
    btn.textContent = 'Download Resume (PDF)';
    btn.disabled = false;
    alert('Failed to generate PDF. Please try again.');
  }

  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('download-resume');
    if (btn) {
      btn.addEventListener('click', async function() {
        btn.textContent = 'Loading PDF Generator...';
        btn.disabled = true;
        waitForPDFLibraries(async function() {
          try {
            btn.textContent = 'Generating PDF...';
            const container = setupTemporaryContainerAndStyling();
            cloneAndPrepareContentSections(container);
            await generateCanvasAndPDF(container);
            btn.textContent = 'Download Resume (PDF)';
            btn.disabled = false;
          } catch (error) {
            handlePDFGenerationErrorAndUIState(error, btn);
          }
        });
      });
    }
  });

})();