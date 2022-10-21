import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

// Manipulando DOM (caractéristicas do cartão)
function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  };
  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

// Colocando o arquivo no global
globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};

const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      // Casting(transformação de dados em JS)
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};

const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      // inicia com número 4 com dígitos de 0 até 15 dígitos
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      // Inicia com 5 o próximo dígito entre 1 e 5 vai aceitar 0 dígitos até 2 dígitos OU
      // Inicia com 22 o próximo dígito entre 2 e 9 e pode ter mais 1 dígito OU
      // Inicia com 2 o próximo dígito entre 3 e 7 pode ter entre 0 e 2 dígitos depois
      // Se passar na primeira parte é prq vai de 0 e mais 12 dígitos
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    // Fazendo um replace de tudo que não é Digito para vazio
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });
    console.log(foundMask);
    return foundMask;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPatter);
