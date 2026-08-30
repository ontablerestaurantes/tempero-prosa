export const produtos = [

  // =========================
  // CAFÉ DA MANHÃ
  // =========================
  {
    id: 1,
    nome: "Aipim",
    categoria: "cafe",
    preco: 12,
    imagem: "assets/img/aipim.jpg",
    descricao: "Aipim cozido, macio e servido no ponto certo.",
    opcoes: opcoesCafeDaManha()
  },

  {
    id: 2,
    nome: "Cuscuz",
    categoria: "cafe",
    preco: 10,
    imagem: "assets/img/cuscuz.jpg",
    descricao: "Cuscuz quentinho e preparado na hora.",
    opcoes: opcoesCafeDaManha()
  },

  {
    id: 3,
    nome: "Feijoada",
    categoria: "cafe",
    preco: 16,
    imagem: "assets/img/feijoada.jpg",
    descricao: "Feijoada bem temperada para o café da manhã.",
    opcoes: opcoesCafeDaManha()
  },

  {
    id: 4,
    nome: "Banana-da-terra",
    categoria: "cafe",
    preco: 11,
    imagem: "assets/img/bananaterra.jpg",
    descricao: "Banana-da-terra preparada no ponto certo.",
    opcoes: opcoesCafeDaManha()
  },

  {
    id: 5,
    nome: "Inhame",
    categoria: "cafe",
    preco: 11,
    imagem: "assets/img/inhame.jpg",
    descricao: "Inhame cozido, macio e saboroso.",
    opcoes: opcoesCafeDaManha()
  },

  {
    id: 6,
    nome: "Batata-doce",
    categoria: "cafe",
    preco: 10,
    imagem: "assets/img/batata-doce.jpg",
    descricao: "Batata-doce cozida e preparada no ponto certo.",
    opcoes: opcoesCafeDaManha()
  },

  // =========================
  // PRATOS FEITOS — PF
  // =========================
  {
    id: 20,
    nome: "PF Assado de Boi",
    categoria: "pf",
    preco: 25,
    imagem: "assets/img/bife-carne.jpg",
    descricao: "Prato feito com assado de boi e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 21,
    nome: "PF Frango Frito",
    categoria: "pf",
    preco: 22,
    imagem: "assets/img/frango-frito.jpg",
    descricao: "Prato feito com frango frito e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 22,
    nome: "PF Frango Ensopado",
    categoria: "pf",
    preco: 22,
    imagem: "assets/img/ensfrango.jpg",
    descricao: "Prato feito com frango ensopado e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 23,
    nome: "PF Ensopado de Boi",
    categoria: "pf",
    preco: 24,
    imagem: "assets/img/ensboi.jpg",
    descricao: "Prato feito com ensopado de boi e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 24,
    nome: "PF Filé de Frango Empanado",
    categoria: "pf",
    preco: 23,
    imagem: "assets/img/frango-empanado.jpg",
    descricao: "Prato feito com filé de frango empanado e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 25,
    nome: "PF Filé de Frango Acebolado",
    categoria: "pf",
    preco: 23,
    imagem: "assets/img/frango-acebolado.jpg",
    descricao: "Prato feito com filé de frango acebolado e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 26,
    nome: "PF Bife de Carne Acebolado",
    categoria: "pf",
    preco: 25,
    imagem: "assets/img/bife-carne.jpg",
    descricao: "Prato feito com bife de carne acebolado e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 27,
    nome: "PF Bife de Carne ao Molho",
    categoria: "pf",
    preco: 25,
    imagem: "assets/img/bife-molho.jpg",
    descricao: "Prato feito com bife de carne ao molho e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 28,
    nome: "PF Carne do Sol",
    categoria: "pf",
    preco: 28,
    imagem: "assets/img/carne-sol.jpg",
    descricao: "Prato feito com carne do sol e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 29,
    nome: "PF Carne de Sertão Frita",
    categoria: "pf",
    preco: 27,
    imagem: "assets/img/carne-sertao-frita.png",
    descricao: "Prato feito com carne de sertão frita e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 30,
    nome: "PF Feijoada",
    categoria: "pf",
    preco: 24,
    imagem: "assets/img/feijoada.jpg",
    descricao: "Prato feito com feijoada e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 31,
    nome: "PF Quiabada",
    categoria: "pf",
    preco: 24,
    imagem: "assets/img/quiabada.jpg",
    descricao: "Prato feito com quiabada e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  {
    id: 32,
    nome: "PF Moqueca de Fato",
    categoria: "pf",
    preco: 26,
    imagem: "assets/img/moq-fato.jpg",
    descricao: "Prato feito com moqueca de fato e acompanhamentos à escolha.",
    opcoes: opcoesPF()
  },

  // =========================
  // COMIDAS BAIANAS
  // =========================
  {
    id: 40,
    nome: "Moqueca de Marisco",
    categoria: "baiana",
    preco: 38,
    imagem: "assets/img/moqueca-marisco.jpg",
    descricao: "Moqueca de marisco preparada com tempero da casa.",
    opcoes: opcoesComidaBaiana()
  },

  {
    id: 41,
    nome: "Moqueca de Peixe",
    categoria: "baiana",
    preco: 36,
    imagem: "assets/img/moq-peixe.jpg",
    descricao: "Moqueca de peixe preparada com tempero da casa.",
    opcoes: opcoesComidaBaiana()
  },

  {
    id: 42,
    nome: "Comida Baiana",
    categoria: "baiana",
    preco: 32,
    imagem: "assets/img/comida-baiana.jpg",
    descricao: "Prato típico baiano preparado conforme a casa.",
    opcoes: opcoesComidaBaiana()
  },

  {
    id: 43,
    nome: "Peixe Frito",
    categoria: "baiana",
    preco: 34,
    imagem: "assets/img/peixe-frito.jpg",
    descricao: "Peixe frito servido com até um acompanhamento à escolha.",
    opcoes: opcoesComidaBaiana()
  },

  // =========================
  // DIFERENCIADOS
  // =========================
  {
    id: 50,
    nome: "Pirão de Aipim",
    categoria: "diferenciados",
    preco: 26,
    imagem: "assets/img/pirao-aipim.jpg",
    descricao: "Prato preparado conforme a receita da casa.",
    opcoes: []
  },

  {
    id: 51,
    nome: "Carne do Sol",
    categoria: "diferenciados",
    preco: 32,
    imagem: "assets/img/carne-sol.jpg",
    descricao: "Prato preparado conforme a receita da casa.",
    opcoes: []
  },

  {
    id: 52,
    nome: "Calabresa",
    categoria: "diferenciados",
    preco: 24,
    imagem: "assets/img/calabresao.jpg",
    descricao: "Prato preparado conforme a receita da casa.",
    opcoes: []
  },

  {
    id: 53,
    nome: "Dobradinha",
    categoria: "diferenciados",
    preco: 28,
    imagem: "assets/img/dobradinha.jpg",
    descricao: "Servida com arroz.",
    opcoes: []
  },

  // =========================
  // SOBREMESAS
  // =========================
  {
    id: 60,
    nome: "Pudim",
    categoria: "sobremesa",
    preco: 8,
    imagem: "assets/img/pudim.jpg",
    descricao: "Pudim cremoso, porção individual.",
    opcoes: []
  },

  {
    id: 61,
    nome: "Mousse de Maracujá",
    categoria: "sobremesa",
    preco: 9,
    imagem: "assets/img/mousse-maracuja.jpg",
    descricao: "Mousse de maracujá, porção individual.",
    opcoes: []
  },

  // =========================
  // PETISCOS
  // =========================
  {
    id: 70,
    nome: "Batata Frita",
    categoria: "petisco",
    preco: 18,
    imagem: "assets/img/batata-frita.jpg",
    descricao: "Batata frita crocante, sem acompanhamento obrigatório.",
    opcoes: []
  },

  // =========================
  // PORÇÕES
  // =========================
  {
    id: 71,
    nome: "Porção de Arroz",
    categoria: "porcao",
    preco: 7,
    imagem: "assets/img/arroz.jpg",
    descricao: "Porção individual de arroz.",
    opcoes: []
  },

  {
    id: 72,
    nome: "Porção de Feijão",
    categoria: "porcao",
    preco: 7,
    imagem: "assets/img/feijao.jpg",
    descricao: "Porção individual de feijão.",
    opcoes: []
  },

  {
    id: 73,
    nome: "Porção de Macarrão",
    categoria: "porcao",
    preco: 8,
    imagem: "assets/img/macarrao.jpg",
    descricao: "Porção individual de macarrão.",
    opcoes: []
  },

  // =========================
  // BEBIDAS — SUCOS
  // =========================
  {
    id: 100,
    nome: "Suco de Frutas",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 7,
    imagem: "assets/img/suco.jpg",
    descricao: "Suco de frutas preparado no sabor e tamanho escolhidos.",
    opcoes: opcoesSuco(7, 10)
  },

  {
    id: 101,
    nome: "Suco de Polpa",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 6,
    imagem: "assets/img/sucopolpa.png",
    descricao: "Suco de polpa preparado no sabor e tamanho escolhidos.",
    opcoes: opcoesSuco(6, 8.5)
  },

  // =========================
  // BEBIDAS — REFRIGERANTES
  // =========================
  {
    id: 102,
    nome: "Refrigerante 1 litro",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 12,
    imagem: "assets/img/garrafa-1l.jpg",
    descricao: "Refrigerante de 1 litro. Escolha uma marca.",
    opcoes: opcoesRefrigerante()
  },

  {
    id: 103,
    nome: "Refrigerante Lata",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 6.5,
    imagem: "assets/img/refrigerante-lata.jpg",
    descricao: "Refrigerante em lata. Escolha uma marca.",
    opcoes: opcoesRefrigerante()
  },

  // =========================
  // BEBIDAS — CERVEJAS
  // =========================
  {
    id: 104,
    nome: "Império",
    categoria: "bebida",
    subcategoria: "alcoolica",
    preco: 8,
    imagem: "assets/img/imperio.jpg",
    descricao: "Cerveja gelada. Volume pode ser ajustado posteriormente no cadastro.",
    opcoes: []
  },

  {
    id: 105,
    nome: "Stella",
    categoria: "bebida",
    subcategoria: "alcoolica",
    preco: 10,
    imagem: "assets/img/stella.jpg",
    descricao: "Cerveja gelada. Volume pode ser ajustado posteriormente no cadastro.",
    opcoes: []
  },

  {
    id: 106,
    nome: "Heineken",
    categoria: "bebida",
    subcategoria: "alcoolica",
    preco: 12,
    imagem: "assets/img/heineken.jpg",
    descricao: "Cerveja gelada. Volume pode ser ajustado posteriormente no cadastro.",
    opcoes: []
  },

  // =========================
  // BEBIDAS — ÁGUAS E CAFÉ
  // =========================
  {
    id: 107,
    nome: "Água Mineral",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 3,
    imagem: "assets/img/agua.jpg",
    descricao: "Água mineral sem gás.",
    opcoes: []
  },

  {
    id: 108,
    nome: "Água com Gás",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 4.5,
    imagem: "assets/img/agua-gas.jpg",
    descricao: "Água mineral com gás.",
    opcoes: []
  },

  {
    id: 109,
    nome: "Café",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 3,
    imagem: "assets/img/cafe.jpg",
    descricao: "Escolha o tamanho do copo e se deseja café preto ou com leite.",
    opcoes: opcoesCafeBebida()
  }

];

function opcoesCafeDaManha() {
  return [
    {
      titulo: "Acompanhamento",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 acompanhamento",
      itens: [
        { nome: "Ovos", imagem: "assets/img/ovo-frito.jpg" },
        { nome: "Ensopado de boi", imagem: "assets/img/ensboi.jpg" },
        { nome: "Ensopado de frango", imagem: "assets/img/ensfrango.jpg" },
        { nome: "Carne de sertão frita", imagem: "assets/img/carne-sol.jpg" },
        { nome: "Carne do sol", imagem: "assets/img/carne-sol.jpg" }
      ]
    }
  ];
}

function opcoesPF() {
  return [
    {
      titulo: "Guarnições",
      tipo: "checkbox",
      min: 1,
      max: 3,
      itens: [
        { nome: "Arroz", imagem: "assets/img/arroz.jpg" },
        { nome: "Feijão", imagem: "assets/img/feijao.jpg" },
        { nome: "Macarrão", imagem: "assets/img/macarrao.jpg" }
      ]
    },

    {
      titulo: "Salada",
      tipo: "radio",
      obrigatorio: false,
      subtitulo: "Escolha até 1 opção",
      itens: [
        { nome: "Salada de verduras", imagem: "assets/img/salada-verduras.jpg" },
        { nome: "Salada de tomate, cebola e pepino", imagem: "assets/img/salada-vinagrete.jpg" },
        { nome: "Sem salada", imagem: "assets/img/sem-nada.jpg" }
      ]
    },

    {
      titulo: "Adicionais",
      tipo: "checkbox",
      min: 0,
      max: 2,
      itens: [
        { nome: "Purê de batata", imagem: "assets/img/pure-batata.jpg", precoAdicional: 4 },
        { nome: "Ovos fritos", imagem: "assets/img/ovo-frito.jpg", precoAdicional: 3 }
      ]
    }
  ];
}

function opcoesComidaBaiana() {
  return [
    {
      titulo: "Acompanhamento",
      tipo: "radio",
      obrigatorio: false,
      subtitulo: "Escolha até 1 acompanhamento",
      itens: [
        { nome: "Caruru", imagem: "assets/img/caruru.jpg" },
        { nome: "Vatapá", imagem: "assets/img/vatapa.jpg" },
        { nome: "Feijão-fradinho", imagem: "assets/img/feijao-fradinho.jpg" },
        { nome: "Farofa", imagem: "assets/img/com-farinha.jpg" }
      ]
    }
  ];
}

function opcoesSuco(preco300ml, preco500ml) {
  return [
    {
      titulo: "Sabor",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 sabor",
      itens: [
        { nome: "Cajá", imagem: "assets/img/sucoamarelo.jpg" },
        { nome: "Caju", imagem: "assets/img/sucobranco.jpg" },
        { nome: "Umbu", imagem: "assets/img/sucobranco.jpg" },
        { nome: "Maracujá", imagem: "assets/img/sucoamarelo.jpg" },
        { nome: "Manga", imagem: "assets/img/sucoamarelo.jpg" },
        { nome: "Cacau", imagem: "assets/img/sucobranco.jpg" },
        { nome: "Cupuaçu", imagem: "assets/img/sucobranco.jpg" }
      ]
    },

    {
      titulo: "Tamanho",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 tamanho",
      itens: [
        { nome: "300 ml", imagem: "assets/img/copo-300ml.jpg", precoVariacao: preco300ml },
        { nome: "500 ml", imagem: "assets/img/copo-300ml.jpg", precoVariacao: preco500ml }
      ]
    }
  ];
}

function opcoesRefrigerante() {
  return [
    {
      titulo: "Marca",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 opção",
      itens: [
        { nome: "Coca-Cola", imagem: "assets/img/coca.jpg" },
        { nome: "Pepsi", imagem: "assets/img/pepsi.jpg" },
        { nome: "Guaraná Antarctica", imagem: "assets/img/guarana.jpg" }
      ]
    }
  ];
}

function opcoesCafeBebida() {
  return [
    {
      titulo: "Tamanho do copo",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 tamanho",
      itens: [
        { nome: "50 ml", imagem: "assets/img/copo-50ml.jpg", precoVariacao: 3 },
        { nome: "200 ml", imagem: "assets/img/cafe.jpg", precoVariacao: 5 },
        { nome: "300 ml", imagem: "assets/img/copo-300ml.jpg", precoVariacao: 6.5 }
      ]
    },

    {
      titulo: "Tipo",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 opção",
      itens: [
        { nome: "Preto", imagem: "assets/img/cafe-puro.jpg" },
        { nome: "Com leite", imagem: "assets/img/cafe-com-leite2.jpg" }
      ]
    }
  ];
}

export function getTodayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
}

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
