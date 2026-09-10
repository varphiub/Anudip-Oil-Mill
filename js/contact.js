
document.addEventListener('DOMContentLoaded', function(){
 
  function syncBodyPadding(){
    var header = document.querySelector('.site-header');
    if(!header) return;
    var computed = window.getComputedStyle(header);
    if(computed.position === 'fixed' || computed.position === 'sticky'){
      document.body.style.paddingTop = header.offsetHeight + 'px';
    } else {
      document.body.style.paddingTop = '';
    }
  }
  window.addEventListener('resize', syncBodyPadding);
  // run on load and after a short delay to allow fonts/layout to settle
  syncBodyPadding();
  setTimeout(syncBodyPadding, 300);
  // ensure padding stays correct during scroll (throttled)
  (function(){
    var ticking = false;
    window.addEventListener('scroll', function(){
      if(!ticking){ requestAnimationFrame(function(){ syncBodyPadding(); ticking = false; }); ticking = true; }
    }, {passive:true});
  })();

  // Detect and neutralize any ancestor transforms/backdrop-filters/will-change that can break position:fixed
  (function(){
    var header = document.querySelector('.site-header');
    if(!header) return;
    function neutralizeAncestors(){
      var el = header.parentElement;
      var changed = [];
      while(el && el !== document.documentElement){
        try{
          var cs = window.getComputedStyle(el);
          var transform = cs.transform || cs.webkitTransform;
          var backdrop = cs.backdropFilter || cs.webkitBackdropFilter;
          var will = cs.willChange || '';
          if((transform && transform !== 'none') || (backdrop && backdrop !== 'none') || /transform/.test(will)){
            // store originals so we can restore if necessary
            if(!el.hasAttribute('data-original-transform')) el.setAttribute('data-original-transform', el.style.transform || '');
            if(!el.hasAttribute('data-original-backdrop')) el.setAttribute('data-original-backdrop', el.style.backdropFilter || '');
            if(!el.hasAttribute('data-original-will')) el.setAttribute('data-original-will', el.style.willChange || '');

            el.style.transform = 'none';
            el.style.backdropFilter = 'none';
            el.style.willChange = 'auto';
            changed.push(el);
          }
        }catch(e){ /* ignore cross-origin frames */ }
        el = el.parentElement;
      }
      if(changed.length) console.info('Neutralized transforms on', changed);
    }
   
    neutralizeAncestors();
    setTimeout(neutralizeAncestors, 600);

    
    function enforceFixedHeader(){
      try{
        header.style.position = 'fixed';
        header.style.top = '0px';
        header.style.left = '0px';
        header.style.right = '0px';
        header.style.transform = 'none';
        header.style.zIndex = '100000';
        header.style.height = getComputedStyle(header).height || '84px';
        document.body.style.paddingTop = header.offsetHeight + 'px';
      }catch(e){}
    }
    enforceFixedHeader();
    setTimeout(enforceFixedHeader, 400);

    // Watch for added transforms via MutationObserver and neutralize if necessary
    try{
      var mo = new MutationObserver(function(muts){
        muts.forEach(function(m){
          if(m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'class')){
            neutralizeAncestors();
            enforceFixedHeader();
          }
        });
      });
      mo.observe(document.documentElement, {subtree:true, attributes:true, attributeFilter:['style','class']});
    }catch(e){ /* ignore */ }

    
    try{
      var lastTop = null;
      window.addEventListener('scroll', function(){
        var r = header.getBoundingClientRect();
        if(lastTop === null) lastTop = r.top;
        if(r.top !== 0 && r.top !== lastTop){
          console.warn('HEADER MOVED:', {top:r.top, transform: getComputedStyle(header).transform, position: getComputedStyle(header).position});
          lastTop = r.top;
        }
      }, {passive:true});
    }catch(e){}
  })();

  var form = document.getElementById('contactForm');

  function setInvalid(fieldName, message){
    var el = document.getElementById(fieldName);
    if(!el) return;
    var container = el.closest('.field') || el.parentElement;
    container.classList.add('invalid');
    var err = container.querySelector('.error-message');
    if(err) err.textContent = message || err.textContent;
  }
  function clearInvalid(fieldName){
    var el = document.getElementById(fieldName);
    if(!el) return;
    var container = el.closest('.field') || el.parentElement;
    container.classList.remove('invalid');
  }

  function validateEmail(email){
    return /^\S+@\S+\.\S+$/.test(email);
  }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    
    // treat phone as required too
    ['fullName','email','subject','message','phone'].forEach(clearInvalid);

    var full = document.getElementById('fullName').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value.trim();

    var firstInvalid = null;
    if(!full){ setInvalid('fullName','Please enter your full name.'); firstInvalid = firstInvalid || document.getElementById('fullName'); }
    if(!email || !validateEmail(email)){ setInvalid('email','Please provide a valid email address.'); firstInvalid = firstInvalid || document.getElementById('email'); }
    if(!phone){ setInvalid('phone','Please enter a phone number.'); firstInvalid = firstInvalid || document.getElementById('phone'); }
    if(!subject){ setInvalid('subject','Please select a subject for your inquiry.'); firstInvalid = firstInvalid || document.getElementById('subject'); }
    if(!message){ setInvalid('message','Please include a message detailing your request.'); firstInvalid = firstInvalid || document.getElementById('message'); }

    if(firstInvalid){ firstInvalid.focus(); firstInvalid.scrollIntoView({behavior:'smooth',block:'center'}); return; }

    var btn = form.querySelector('.btn-primary');
    var old = btn.innerHTML;

    // show sending state
    btn.innerHTML = '<span class="btn-icon">...</span> Sending...';
    btn.disabled = true;

    // simulate network send
    setTimeout(function(){
      // update button to success state (no banner)
      btn.classList.add('sent');
      btn.innerHTML = 'Sent Successfully <span class="btn-icon">✓</span>';

      // keep form cleared and disable inputs to match final state
      form.reset();
      var fields = form.querySelectorAll('input,textarea,select');
      fields.forEach(function(f){ f.disabled = true; });

      // ensure button remains visible and focused for accessibility
      btn.focus();

    }, 900);
  });

  
  ['fullName','email','subject','message','phone'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('input', function(){ clearInvalid(id); });
  });

  // Initialize custom select components
  (function(){
    var customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(function(wrapper){
      var trigger = wrapper.querySelector('.custom-select-trigger');
      var list = wrapper.querySelector('.custom-select-list');
      var options = Array.from(list.querySelectorAll('li')).filter(function(li){ return !li.classList.contains('header'); });
      var native = document.getElementById(wrapper.getAttribute('data-for'));
      if(!trigger || !list || !native) return;

      function open(){ wrapper.classList.add('open'); wrapper.setAttribute('aria-expanded','true'); list.setAttribute('aria-hidden','false'); }
      function close(){ wrapper.classList.remove('open'); wrapper.setAttribute('aria-expanded','false'); list.setAttribute('aria-hidden','true'); }
      function toggle(){ if(wrapper.classList.contains('open')) close(); else open(); }

      // set initial label from native select
      var initial = native.options[native.selectedIndex] ? native.options[native.selectedIndex].text : trigger.textContent;
      trigger.firstChild && (trigger.firstChild.nodeValue = initial + ' ');

      trigger.addEventListener('click', function(e){ e.stopPropagation(); toggle(); });

      options.forEach(function(opt){
        opt.addEventListener('click', function(e){
          var val = opt.getAttribute('data-value');
          var text = opt.textContent;
          // set native
          native.value = val;
          // update visuals
          options.forEach(function(o){ o.removeAttribute('aria-selected'); });
          opt.setAttribute('aria-selected','true');
          trigger.innerHTML = text + ' <span class="arrow">▾</span>';
          close();
          // fire input event for validation listeners
          var ev = new Event('input', {bubbles:true}); native.dispatchEvent(ev);
        });
      });

      // keyboard support
      var focusedIndex = -1;
      wrapper.addEventListener('keydown', function(e){
        if(e.key === 'ArrowDown'){
          e.preventDefault();
          if(!wrapper.classList.contains('open')){ open(); focusedIndex = 0; options[0].focus(); }
          else { focusedIndex = Math.min(options.length-1, focusedIndex+1); options[focusedIndex].focus(); }
        } else if(e.key === 'ArrowUp'){
          e.preventDefault();
          if(!wrapper.classList.contains('open')){ open(); focusedIndex = options.length-1; options[focusedIndex].focus(); }
          else { focusedIndex = Math.max(0, focusedIndex-1); options[focusedIndex].focus(); }
        } else if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          if(wrapper.classList.contains('open') && focusedIndex >=0){ options[focusedIndex].click(); }
          else { toggle(); }
        } else if(e.key === 'Escape'){
          close();
        }
      });

      // close on outside click
      document.addEventListener('click', function(){ close(); });
      // prevent clicks inside list from closing via document listener
      list.addEventListener('click', function(e){ e.stopPropagation(); });
    });
  })();

  // Staggered entrance animation for cards
  (function(){
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(c, i){ c.classList.add('animate'); c.style.animationDelay = (i*80)+'ms'; });
  })();

  // Ensure ampersand glyph displays: if Playfair Display isn't available, fall back to Georgia
  (function(){
    function applyAmpFallback(){
      var texts = document.querySelectorAll('.amp svg text');
      if(!texts || texts.length===0) return;
      texts.forEach(function(t){
        // if Playfair not available, switch to Georgia
        t.setAttribute('font-family', "Georgia, serif");
      });
      document.querySelectorAll('.amp').forEach(function(el){ el.classList.add('font-fallback'); });
    }

    // If Font Loading API available, wait for fonts to finish loading and then check
    if(document.fonts && document.fonts.ready){
      document.fonts.ready.then(function(){
        try{
          if(!document.fonts.check("1em 'Playfair Display'")){
            applyAmpFallback();
          }
        }catch(e){
          // on any error, apply fallback to be safe
          applyAmpFallback();
        }
      }).catch(function(){ applyAmpFallback(); });
    } else {
      // Fallback for browsers without Font Loading API: apply fallback after short delay
      setTimeout(applyAmpFallback, 600);
    }
  })();

});