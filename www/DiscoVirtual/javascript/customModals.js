class CustomAlert {
    constructor(headerMessage, message, fn = ()=>{}) {        
        this.headerMessage = headerMessage;
        this.message = message;
        this.fn = fn;
        this.show();
    }

    show() {
        const html =`
            <div id="modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">                        
                        <h2>${this.headerMessage}</h2>                        
                    </div>
                    <div class="modal-body">
                        <p>${this.message}</p>
                    </div> 
                    <div class="modal-footer">                        
                        <button id="close_btn">Aceptar</button>
                    </div>
                </div>
            </div>
            `;

        document.body.insertAdjacentHTML('afterbegin', html);

        const modalClose = document.querySelector('#modal #close_btn');
        modalClose.addEventListener('click', () => {
            this.close();
            this.fn();
        });
    }

    close() {
        const modal = document.getElementById('modal');
        modal.parentNode.removeChild(modal);        
    }
}


class CustomPrompt {
    constructor(headerMessage, label, fn) {
        this.headerMessage = headerMessage;
        this.label = label;    
        this.fn = fn;
        
        this.show();
    }
    
    show() {        
        const html =`
            <div id="modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">                    
                        <h2>${this.headerMessage}</h2>
                    </div>
                    <div class="modal-body">
                        <label>${this.label}</label>
                        <input id="modal_input" tipe="text">
                    </div> 
                    <div class="modal-footer">                        
                        <button id="close_btn">Cancelar</button>
                        <button id="submit_btn">Aceptar</button>
                    </div>
                </div>
            </div>
            `;        

        document.body.insertAdjacentHTML('afterbegin', html);

        const modalSubmit = document.querySelector('#modal #submit_btn');
        modalSubmit.addEventListener('click', () => {
            const inputValue = this.getInput();
            this.fn(inputValue);
        });

        const modalClose = document.querySelector('#modal #close_btn');
        modalClose.addEventListener('click', () => {
            this.close();
            this.fn(null);
        });
    }        

    getInput() {
        const inputValue =  document.querySelector('#modal #modal_input').value;
        this.close();

        return inputValue;
    }

    close() {
        const modal = document.getElementById('modal');
        modal.parentNode.removeChild(modal);
    }
}


class CustomConfirm {
    constructor(headerMessage, message, fn) {
        this.headerMessage = headerMessage;
        this.message = message;    
        this.fn = fn;  
        
        this.show();
    }
    
    show() {        
        const html =`
            <div id="modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">                    
                        <h2>${this.headerMessage}</h2>
                    </div>
                    <div class="modal-body">
                        <p>${this.message}</p>
                    </div> 
                    <div class="modal-footer">                        
                        <button id="close_btn">Cancelar</button>
                        <button id="submit_btn">Confirmar</button>
                    </div>
                </div>
            </div>
            `;        

        document.body.insertAdjacentHTML('afterbegin', html);

        const modalSubmit = document.querySelector('#modal #submit_btn');
        modalSubmit.addEventListener('click', () => {
            this.close();
            this.fn(true);
        });

        const modalClose = document.querySelector('#modal #close_btn');
        modalClose.addEventListener('click', () => {
            this.close();
            this.fn(false);
        });
    }
    
    close() {
        const modal = document.getElementById('modal');
        modal.parentNode.removeChild(modal);        
    }
}