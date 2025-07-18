document.addEventListener("DOMContentLoaded", () => {
  const koszykLista = document.querySelector("#lista-koszyka");
  const sumaElement = document.querySelector("#suma");
  const pustyKomunikat = document.querySelector("#koszyk-pusty");

  // Pobierz koszyk z localStorage lub pustą tablicę
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  }

  // Zapisz koszyk do localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Formatowanie ceny na format PL z przecinkiem
  function formatPrice(value) {
    return value.toFixed(2).replace(".", ",") + " zł";
  }

  // Renderowanie koszyka na stronie
  function renderCart() {
    if (!koszykLista || !sumaElement || !pustyKomunikat) return;

    const cart = getCart();
    koszykLista.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      pustyKomunikat.style.display = "block";
      sumaElement.textContent = "Suma: 0,00 zł";
      return;
    } else {
      pustyKomunikat.style.display = "none";
    }

    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "pozycja-koszyka";
      li.innerHTML = `
        <img src="${item.img}" alt="${item.title}" width="50" height="50" />
        <div>
          <h3>${item.title}</h3>
          <p class="cena">${formatPrice(item.price)}</p>
        </div>
        <button type="button" data-index="${index}" aria-label="Usuń ${item.title} z koszyka">🗑 Usuń</button>
      `;
      koszykLista.appendChild(li);
      total += item.price;
    });

    sumaElement.textContent = `Suma: ${formatPrice(total)}`;

    // Podpinanie eventów do przycisków Usuń
    koszykLista.querySelectorAll("button[data-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index, 10);
        if (isNaN(index)) return;

        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
      });
    });
  }

  // Obsługa przycisków dodających produkt (np. na stronie sklepu)
  document.querySelectorAll("button[data-product-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.productId;
      const title = button.dataset.title;
      const priceStr = button.dataset.price;
      const img = button.dataset.img;

      if (!id || !title || !priceStr) {
        alert("Brak danych produktu.");
        return;
      }

      // Zamiana ceny z formatu np. "12,34" na float 12.34
      const price = parseFloat(priceStr.replace(",", "."));
      if (isNaN(price)) {
        alert("Nieprawidłowa cena produktu.");
        return;
      }

      const cart = getCart();
      cart.push({ id, title, price, img });
      saveCart(cart);

      alert(`Dodano do koszyka: ${title}`);
    });
  });

  // Jeśli na stronie jest koszyk – wyświetlamy go
  if (koszykLista && sumaElement) {
    renderCart();
  }
});
