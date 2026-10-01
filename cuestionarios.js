/* Control compartido de los cuestionarios de SOSIALIZARTE. */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const form = document.querySelector('form[data-questionnaire]');
    if (!form) return;
    const kind = form.dataset.questionnaire;
    const testMode = new URLSearchParams(location.search).get('modo') === 'pruebas';
    const sections = Array.from(form.querySelectorAll('.section-block'));
    const next = document.getElementById('nextBtn');
    const previous = document.getElementById('prevBtn');
    const submit = document.getElementById('submitBtn');
    const banner = document.getElementById('sectionErrorBanner');
    const status = document.getElementById('draftStatus');
    const draftKey = `sosializarte:cuestionario:v1:${kind}:${testMode ? 'pruebas' : 'cliente'}`;
    let current = 0;
    let savingEnabled = false;
    let sending = false;
    let saveTimer;
    const field = name => form.elements.namedItem(name);
    const message = text => { status.textContent = text; };
    const hiddenValue = (name, value) => {
        let control = field(name);
        if (!control) {
            control = document.createElement('input');
            control.type = 'hidden'; control.name = name; form.appendChild(control);
        }
        control.value = value;
    };
    const newId = () => window.crypto?.randomUUID?.() || `sol-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let requestId = newId();
    hiddenValue('tipo_cuestionario', kind);
    hiddenValue('id_solicitud', requestId);
    hiddenValue('origen', location.pathname);
    hiddenValue('modo_pruebas', testMode ? 'si' : 'no');
    const subject = `${testMode ? '[PRUEBA] ' : ''}Cuestionario ${kind} — SOSIALIZARTE`;
    hiddenValue('_subject', subject);

    // Se valida cada sección y se vuelve a validar todo antes de enviar.
    // novalidate evita que campos de pasos ocultos bloqueen el envío sin explicación.
    form.noValidate = true;
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'assertive');

    let nextControlId = 0;
    const connectLabels = () => {
        form.querySelectorAll('.field').forEach(wrapper => {
            const label = Array.from(wrapper.children).find(el => el.tagName === 'LABEL');
            const control = wrapper.querySelector('input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea, select');
            if (!label || !control || label.querySelector('input')) return;
            if (!control.id) {
                let id;
                do { id = `${kind}-campo-${nextControlId++}`; } while (document.getElementById(id));
                control.id = id;
            }
            label.htmlFor = control.id;
            const error = wrapper.querySelector('.field-error-msg');
            if (error) {
                error.id = `${control.id}-error`;
                control.setAttribute('aria-describedby', error.id);
            }
        });
    };
    connectLabels();
    form.querySelectorAll('input[type="email"]').forEach(el => { el.autocomplete = 'email'; el.inputMode = 'email'; });
    form.querySelectorAll('input[type="url"]').forEach(el => { el.inputMode = 'url'; el.autocapitalize = 'none'; });
    form.querySelectorAll('input[type="tel"]').forEach(el => { el.autocomplete = 'tel'; el.inputMode = 'tel'; });
    ['contacto_nombre', 'responsable'].forEach(name => { const el = field(name); if (el) el.autocomplete = 'name'; });

    // Agregar horarios libres sin obligar al cliente a elegir una franja incorrecta.
    form.querySelectorAll('select[name^="horario_"]').forEach(select => {
        const option = document.createElement('option'); option.value = 'Otro'; option.textContent = 'Otro horario'; select.appendChild(option);
        const wrapper = document.createElement('div'); wrapper.className = 'field'; wrapper.hidden = true;
        const label = document.createElement('label'); label.textContent = 'Especifica el horario';
        const input = document.createElement('input'); input.name = `${select.name}_otro`; input.type = 'text';
        input.placeholder = 'Ej. 9:30 a 14:00 y 16:00 a 19:00';
        const error = document.createElement('div'); error.className = 'field-error-msg'; error.textContent = 'Especifica el horario.';
        wrapper.append(label, input, error); select.parentElement.appendChild(wrapper);
        const sync = () => { wrapper.hidden = select.value !== 'Otro'; input.disabled = wrapper.hidden; input.required = !wrapper.hidden; };
        select.addEventListener('change', sync); sync();
    });
    connectLabels();

    const syncConditions = () => {
        const channel = field('medio_contacto');
        if (channel) {
            [['contacto_email', 'correo'], ['contacto_whatsapp', 'whatsapp']].forEach(([name, value]) => {
                const el = field(name), wrapper = el.closest('.field');
                const selected = channel.value === value;
                wrapper.hidden = !selected; el.disabled = !selected; el.required = selected;
            });
        }
        const wantsChatbot = field('incluye_chatbot');
        if (wantsChatbot) {
            const block = form.querySelector('[data-chatbot-section]');
            const included = wantsChatbot.value === 'Si';
            block.dataset.skipped = included ? 'false' : 'true';
            block.querySelectorAll('input, textarea, select').forEach(el => { el.disabled = !included; });
        }
        [['prioridad', 'prioridad_otra', 'Otra'], ['escalamiento', 'escalamiento_otro', 'Otro'], ['tono', 'tono_otro', 'Otro']].forEach(([group, target, value]) => {
            const el = field(target); if (!el) return;
            const selected = Array.from(form.querySelectorAll('input')).some(input => input.name === group && input.checked && input.value === value);
            el.required = selected;
        });
        // Disparar los eventos solo de horarios mantiene correctos los campos recuperados.
        form.querySelectorAll('select[name^="horario_"]').forEach(el => el.dispatchEvent(new Event('change')));
    };
    const activeSections = () => sections.filter(section => section.dataset.skipped !== 'true');
    const show = (index, scroll = true) => {
        const active = activeSections();
        current = Math.max(0, Math.min(index, active.length - 1));
        sections.forEach(section => { const visible = section === active[current]; section.hidden = !visible; section.style.display = visible ? 'block' : 'none'; section.classList.toggle('active', visible); });
        document.getElementById('progressFill').style.width = `${((current + 1) / active.length) * 100}%`;
        const progressLabel = document.getElementById('progressLabel');
        if (progressLabel) progressLabel.textContent = `Sección ${current + 1} de ${active.length}`;
        const count = document.getElementById('sectionCount'), total = document.getElementById('totalSections'), title = document.getElementById('sectionName');
        if (count) count.textContent = current + 1;
        if (total) total.textContent = active.length;
        if (title) title.textContent = active[current].querySelector('h2')?.textContent.trim() || 'Sección';
        previous.style.visibility = current === 0 ? 'hidden' : 'visible';
        next.style.display = current === active.length - 1 ? 'none' : 'inline-flex';
        submit.style.display = current === active.length - 1 ? 'inline-flex' : 'none';
        banner.classList.remove('visible');
        if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const mark = (wrapper, controls, errorText) => {
        const invalid = Boolean(errorText);
        wrapper.classList.toggle('field-invalid', invalid);
        controls.forEach(el => el.setAttribute('aria-invalid', String(invalid)));
        let error = wrapper.querySelector('.field-error-msg');
        if (!error && errorText) {
            error = document.createElement('div'); error.className = 'field-error-msg'; wrapper.appendChild(error);
            if (controls[0]?.id) { error.id = `${controls[0].id}-error`; controls[0].setAttribute('aria-describedby', error.id); }
        }
        if (error && errorText) error.textContent = errorText;
    };
    const validate = section => {
        let first = null;
        section.querySelectorAll('.field').forEach(wrapper => {
            const controls = Array.from(wrapper.querySelectorAll('input, textarea, select')).filter(el => !el.disabled && el.type !== 'hidden' && el.type !== 'file');
            if (!controls.length) return;
            const checkboxGroup = wrapper.dataset.checkboxRequired;
            const radioGroup = wrapper.dataset.radioRequired;
            const group = checkboxGroup || radioGroup;
            let problem = '';
            let invalidControl = null;
            if (group && !controls.some(el => el.name === group && el.checked)) {
                problem = 'Selecciona al menos una opción.'; invalidControl = controls.find(el => el.name === group);
            }
            for (const el of controls) {
                if (el.type === 'radio' || el.type === 'checkbox') continue;
                if (el.required && !el.value.trim()) problem = 'Completa este campo para continuar.';
                else if (el.value && !el.checkValidity()) problem = el.type === 'email' ? 'Escribe un correo válido, por ejemplo nombre@negocio.com.' : el.type === 'url' ? 'Escribe una dirección completa, por ejemplo https://tusitio.com.' : 'Revisa el formato de este campo.';
                else if (el.type === 'tel' && el.value.trim() && !/^\+?[\d\s().-]+$/.test(el.value.trim())) problem = 'Escribe un teléfono con números y, si aplica, código de país.';
                else if (el.type === 'tel' && el.value.trim() && (el.value.replace(/\D/g, '').length < 10 || el.value.replace(/\D/g, '').length > 15)) problem = 'El teléfono debe tener entre 10 y 15 dígitos.';
                else continue;
                invalidControl = el; break;
            }
            mark(wrapper, controls, problem);
            if (problem && !first) first = invalidControl || controls[0];
        });
        if (first) {
            banner.textContent = 'Revisa los campos marcados para continuar.'; banner.classList.add('visible');
            first.focus(); first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    };
    const treatmentContainer = document.getElementById('tratamientosContainer');
    const addTreatment = () => {
        const row = treatmentContainer.querySelector('.tratamiento-row').cloneNode(true);
        row.querySelectorAll('input, select').forEach(el => { el.removeAttribute('id'); if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = ''; });
        row.querySelectorAll('.btn-remove-row').forEach(el => el.remove());
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn-remove-row'; remove.textContent = '×'; remove.setAttribute('aria-label', 'Eliminar tratamiento');
        row.appendChild(remove); treatmentContainer.appendChild(row); connectLabels(); return row;
    };
    const collect = () => {
        const values = Object.create(null);
        Array.from(form.elements).forEach(el => {
            if (!el.name || el.name.startsWith('_') || ['hidden', 'file', 'submit', 'button'].includes(el.type)) return;
            const list = values[el.name] || (values[el.name] = []);
            if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked) list.push(el.value); }
            else list.push(el.value);
        });
        return { version: 1, values, section: current, requestId, treatmentRows: treatmentContainer?.querySelectorAll('.tratamiento-row').length || 0 };
    };
    const readDraft = () => {
        try { const draft = JSON.parse(localStorage.getItem(draftKey)); return draft?.version === 1 && draft.values && typeof draft.values === 'object' ? draft : null; } catch { return null; }
    };
    const save = () => {
        if (!savingEnabled || sending) return;
        try {
            localStorage.setItem(draftKey, JSON.stringify(collect()));
            document.getElementById('restoreDraftBtn').hidden = false;
            document.getElementById('clearDraftBtn').hidden = false;
            message('Avance guardado en este dispositivo. Los archivos adjuntos deben seleccionarse de nuevo al regresar.');
        } catch { message('Este navegador no permite guardar el avance. Puedes seguir llenando y enviar el cuestionario.'); }
    };
    const restore = () => {
        const draft = readDraft(); if (!draft) { message('No hay un avance guardado para este cuestionario.'); return; }
        if (treatmentContainer) {
            while (treatmentContainer.querySelectorAll('.tratamiento-row').length > 1) treatmentContainer.lastElementChild.remove();
            for (let i = 1; i < Math.min(draft.treatmentRows || 1, 100); i++) addTreatment();
        }
        const counts = Object.create(null);
        Array.from(form.elements).forEach(el => {
            if (!el.name || el.name.startsWith('_') || ['hidden', 'file', 'submit', 'button'].includes(el.type)) return;
            const values = draft.values[el.name]; if (!Array.isArray(values)) return;
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = values.includes(el.value);
            else { const index = counts[el.name] || 0; if (typeof values[index] === 'string') el.value = values[index]; counts[el.name] = index + 1; }
        });
        if (typeof draft.requestId === 'string') { requestId = draft.requestId; hiddenValue('id_solicitud', requestId); }
        savingEnabled = true; syncConditions(); show(draft.section || 0);
        message('Avance recuperado. Puedes corregir tus respuestas antes de enviarlas. Vuelve a seleccionar los archivos si los tenías.');
    };
    document.getElementById('saveDraftBtn').addEventListener('click', () => { savingEnabled = true; save(); });
    document.getElementById('restoreDraftBtn').addEventListener('click', restore);
    document.getElementById('clearDraftBtn').addEventListener('click', () => {
        try { localStorage.removeItem(draftKey); savingEnabled = false; document.getElementById('restoreDraftBtn').hidden = true; document.getElementById('clearDraftBtn').hidden = true; message('Avance guardado eliminado. Tus respuestas actuales siguen en pantalla.'); }
        catch { message('No se pudo eliminar el avance guardado en este navegador.'); }
    });
    if (readDraft()) {
        document.getElementById('restoreDraftBtn').hidden = false; document.getElementById('clearDraftBtn').hidden = false;
        message('Tienes un avance guardado en este dispositivo. Pulsa Recuperar avance para continuar.');
    }
    form.addEventListener('input', () => { clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); });
    form.addEventListener('change', event => { if (event.target.name === 'medio_contacto' || event.target.name === 'incluye_chatbot' || ['prioridad', 'escalamiento', 'tono'].includes(event.target.name)) syncConditions(); save(); });
    next.addEventListener('click', () => { syncConditions(); if (!validate(activeSections()[current])) return; show(current + 1); save(); });
    previous.addEventListener('click', () => { show(current - 1); save(); });
    if (treatmentContainer) {
        document.getElementById('addTratamientoBtn').addEventListener('click', () => { addTreatment(); save(); });
        treatmentContainer.addEventListener('click', event => { const button = event.target.closest('.btn-remove-row'); if (button) { button.closest('.tratamiento-row').remove(); save(); } });
    }

    // El botón nunca aparece en la vista normal. No es un control de acceso.
    const autofill = document.getElementById('autofillBtn');
    if (testMode) {
        autofill.hidden = false; autofill.style.removeProperty('display');
        message('Modo de pruebas: el autollenado usa datos ficticios. Enviar crea una solicitud marcada PRUEBA.');
        autofill.addEventListener('click', () => {
            form.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.name.startsWith('_') || ['hidden', 'file', 'button', 'submit'].includes(el.type)) return;
                if (el.type === 'checkbox') { el.checked = false; return; }
                if (el.type === 'radio') { el.checked = !Array.from(form.querySelectorAll('input[type="radio"]')).some(other => other !== el && other.name === el.name && other.checked); return; }
                if (el.tagName === 'SELECT') { el.selectedIndex = Array.from(el.options).findIndex(option => option.value !== ''); return; }
                el.value = el.type === 'email' ? 'pruebas@example.com' : el.type === 'url' ? 'https://example.com' : el.type === 'tel' ? '0000000000' : 'Dato ficticio para pruebas';
            });
            form.querySelectorAll('[data-checkbox-required]').forEach(wrapper => { const el = wrapper.querySelector('input[type="checkbox"]'); if (el) el.checked = true; });
            if (kind === 'overnet') field('nombre_negocio').value = 'Grupo Overnet — PRUEBA';
            if (field('medio_contacto')) field('medio_contacto').value = 'correo';
            if (field('incluye_chatbot')) field('incluye_chatbot').value = 'No';
            syncConditions(); form.querySelectorAll('.field-invalid').forEach(el => el.classList.remove('field-invalid'));
            form.querySelectorAll('[aria-invalid]').forEach(el => el.setAttribute('aria-invalid', 'false'));
            show(0); save(); message('Datos ficticios cargados. Puedes recorrer las secciones y enviar una solicitud marcada PRUEBA.');
        });
    }

    form.querySelectorAll('.field-file').forEach(dropzone => {
        const input = dropzone.querySelector('input[type="file"]');
        dropzone.setAttribute('role', 'button'); dropzone.tabIndex = 0;
        dropzone.setAttribute('aria-label', input.name === 'logo' ? 'Seleccionar logotipo' : 'Seleccionar fotos');
        dropzone.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); input.click(); } });
        input.addEventListener('change', () => {
            const files = Array.from(input.files), label = dropzone.querySelector('.file-label');
            const invalid = files.some(file => file.size > 10 * 1024 * 1024 || !['image/png', 'image/jpeg'].includes(file.type));
            dropzone.classList.toggle('file-error', invalid);
            if (invalid) { input.value = ''; label.textContent = 'Selecciona imágenes PNG o JPG de hasta 10 MB por archivo.'; }
            else label.textContent = files.length ? `${files.length} archivo(s) seleccionado(s)` : 'Seleccionar archivo';
        });
    });
    form.addEventListener('submit', async event => {
        event.preventDefault(); if (sending) return;
        syncConditions();
        const active = activeSections();
        for (let i = 0; i < active.length; i++) {
            // Mostrar primero el paso permite enfocar cualquier error de pasos anteriores.
            const old = current; show(i, false);
            if (!validate(active[i])) return;
            show(old, false);
        }
        save(); sending = true; clearTimeout(saveTimer); submit.disabled = true;
        const original = submit.innerHTML; submit.textContent = 'Enviando…';
        try {
            const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error('El servidor no confirmó el envío.');
            try { localStorage.removeItem(draftKey); } catch { /* El envío ya fue confirmado. */ }
            savingEnabled = false; document.getElementById('formContainer').style.display = 'none';
            const success = document.getElementById('formSuccess'); success.classList.add('visible'); success.setAttribute('tabindex', '-1'); success.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            message('No se confirmó el envío. Tus respuestas siguen aquí: vuelve a intentarlo o escríbenos por WhatsApp.');
            banner.textContent = 'No se pudo enviar el cuestionario. Intenta nuevamente o usa el enlace de WhatsApp.'; banner.classList.add('visible');
        } finally { sending = false; submit.disabled = false; submit.innerHTML = original; }
    });
    syncConditions(); show(0, false);
});
