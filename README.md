# Portfolio-projekt


## Beskrivning
Portfolion presenterar mina färdigheter och tidigare projekt. Implementerat tekniker för att skapa en personlig och responsiv webbsida/portfolio som fungerar bra på både stationära datorer och mobila enheter.

## FIGMA

- https://www.figma.com/design/Wc41U660ACrWKfkP9kzZUV/Untitled?node-id=0-1&p=f&t=AMJCSK86fAaX9f43-0

## Struktur & Tekniker
### HTML-struktur
- **Responsivt meny-system** med en hamburgermeny för mobiler.
- **Modal-fönster** som används för att visa ett kontaktformulär.
- **Kortlayout** för projektpresentation.
- **Ikonbibliotek** från Font Awesome för att visa sociala medier och tekniska kompetenser.
- **Favicons** som anpassas för olika enheter och visar en logga i fliken.
- **Google Fonts** används för att ge en personlig touch.
- **SKärmläsare** För att kunna läsa menyn när den inte syns som text på sidan.
    ```html
    <span class="sr-only">Meny</span> <!-- Text för skärmläsare -->
### CSS-tekniker
- **Flexbox & Grid**:
    ```css
    .about-images {
      display: grid; /* Skapar grid-layout */
      grid-template-columns: repeat(3, 1fr); /* 3 kolumner */
    }

    .skills-icons {
      display: flex; /* Flexbox för ikonerna */
      flex-wrap: wrap; /* Radbrytning vid behov*/
    }
    ```

- **Responsiv Design**:
    - **Media Queries** för att anpassa layouten till olika skärmstorlekar.
    - **clamp()** för dynamisk textstorlek:
    ```css
    .logo {
      font-size: clamp(1.25rem, 4vw + 0.5rem, 2rem);
    }
    ```

- **Animeringar**:
    - Hover-effekter med `transition` och dynamisk feedback på ikoner:
    ```css
    .skill i {
      transition: transform 0.3s ease;
    }
    .skill:hover i {
      transform: scale(1.2); /* Förstoringseffekt */
    }
    ```

### JavaScript-funktionalitet
- **Mobilmeny**:
    - Lägg till eller ta bort klassen 'show' för att visa eller dölja menyn:
    ```javascript
    menuButton.addEventListener('click', () => {
      nav.classList.toggle('show'); // Lägger till/tar bort klassen 'show'
    });
    ```

- **Modal-fönster**:
    - Visar och döljer kontaktformuläret, stängs genom att klicka utanför modal-fönstret.
    - Enkel formulärhantering som förhindrar standardskickning och ger feedback:
    ```javascript
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Förhindrar standardskickning
      alert('Tack!'); // Enkel feedback
    });

- **Skapare Email**
    - skapare: Tommy Larsin
    - email: tommy.larsin@hotmail.com