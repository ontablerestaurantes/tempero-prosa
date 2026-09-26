export const produtos = [

  // =========================
  // CAFÉ DA MANHÃ
  // =========================
  {
    id: 1,
    nome: "Aipim",
    categoria: "cafe",
    preco: 15,
    imagem: "assets/img/aipim.jpg",
    descricao: "Escolha 1 proteína. Com ovos, ensopado de boi ou ensopado de frango: R$ 15,00. Com carne de sertão frita: R$ 18,00.",
    opcoes: opcoesCafeDaManha()
  },
  {
    id: 2,
    nome: "Cuscuz",
    categoria: "cafe",
    preco: 15,
    imagem: "assets/img/cuscuz.jpg",
    descricao: "Escolha 1 proteína. Com ovos, ensopado de boi ou ensopado de frango: R$ 15,00. Com carne de sertão frita: R$ 18,00.",
    opcoes: opcoesCafeDaManha()
  },
  {
    id: 3,
    nome: "Feijoada",
    categoria: "cafe",
    preco: 25,
    imagem: "assets/img/feijoada.jpg",
    descricao: "Feijoada completa para uma pessoa.",
    opcoes: []
  },
  {
    id: 4,
    nome: "Banana-da-terra",
    categoria: "cafe",
    preco: 15,
    imagem: "assets/img/bananaterra.jpg",
    descricao: "Escolha 1 proteína. Com ovos, ensopado de boi ou ensopado de frango: R$ 15,00. Com carne de sertão frita: R$ 18,00.",
    opcoes: opcoesCafeDaManha()
  },
  {
    id: 5,
    nome: "Inhame",
    categoria: "cafe",
    preco: 15,
    imagem: "assets/img/inhame.jpg",
    descricao: "Escolha 1 proteína. Com ovos, ensopado de boi ou ensopado de frango: R$ 15,00. Com carne de sertão frita: R$ 18,00.",
    opcoes: opcoesCafeDaManha()
  },
  {
    id: 6,
    nome: "Batata-doce",
    categoria: "cafe",
    preco: 15,
    imagem: "assets/img/batata-doce.jpg",
    descricao: "Escolha 1 proteína. Com ovos, ensopado de boi ou ensopado de frango: R$ 15,00. Com carne de sertão frita: R$ 18,00.",
    opcoes: opcoesCafeDaManha()
  },

  // =========================
  // PRATOS INDIVIDUAIS — PFs
  // =========================
  {
    id: 20,
    nome: "Assado de Boi",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/assado-boi.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 21,
    nome: "Frango Frito",
    categoria: "pratos_individuais",
    preco: 20,
    imagem: "assets/img/frango-frito.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 22,
    nome: "Frango Ensopado",
    categoria: "pratos_individuais",
    preco: 20,
    imagem: "assets/img/ensfrango.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 23,
    nome: "Ensopado de Boi",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/ensboi.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 24,
    nome: "Filé de Frango Empanado",
    categoria: "pratos_individuais",
    preco: 20,
    imagem: "assets/img/frango-empanado.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 25,
    nome: "Filé de Frango Acebolado",
    categoria: "pratos_individuais",
    preco: 20,
    imagem: "assets/img/frango-acebolado.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 26,
    nome: "Bife de Carne Acebolado",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/bife-carne.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 27,
    nome: "Bife de Carne ao Molho",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/bife-molho.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 28,
    nome: "Carne do Sol",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/carne-sol.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 29,
    nome: "Carne de Sertão Frita",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/carne-sertao-frita.png",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 31,
    nome: "Quiabada",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/quiabada.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 32,
    nome: "Moqueca de Fato",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/moq-fato.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 53,
    nome: "Dobradinha",
    categoria: "pratos_individuais",
    preco: 25,
    imagem: "assets/img/dobradinha.jpg",
    descricao: "Acompanha feijão de caldo, arroz e salada mista.",
    opcoes: []
  },
  {
    id: 30,
    nome: "Feijoada Individual",
    categoria: "feijoada",
    preco: 30,
    imagem: "assets/img/feijoada.jpg",
    descricao: "Acompanha arroz.",
    opcoes: []
  },
  {
    id: 35,
    nome: "Feijoada para 2 Pessoas",
    categoria: "feijoada",
    preco: 55,
    imagem: "assets/img/feijoada.jpg",
    descricao: "Acompanha arroz.",
    opcoes: []
  },

  // =========================
  // COMIDA BAIANA
  // =========================
  {
    id: 40,
    nome: "Comida Baiana",
    categoria: "baiana",
    preco: 25,
    imagem: "assets/img/comida-baiana.jpg",
    descricao: "Acompanha arroz, caruru, vatapá e farofa de azeite. Escolha 1 proteína.",
    opcoes: opcoesComidaBaiana()
  },

  // =========================
  // MOCOTÓ E SARAPATEL
  // =========================
  {
    id: 50,
    nome: "Mocotó Individual",
    categoria: "mocoto",
    preco: 30,
    imagem: "assets/img/mocoto.png",
    descricao: "Acompanha arroz e pirão de mocotó.",
    opcoes: []
  },
  {
    id: 51,
    nome: "Mocotó para 2 Pessoas",
    categoria: "mocoto",
    preco: 55,
    imagem: "assets/img/mocoto.png",
    descricao: "Acompanha arroz e pirão de mocotó.",
    opcoes: []
  },
  {
    id: 33,
    nome: "Sarapatel Individual",
    categoria: "sarapatel",
    preco: 25,
    imagem: "assets/img/sarapatel.webp",
    descricao: "Acompanha arroz.",
    opcoes: []
  },
  {
    id: 52,
    nome: "Sarapatel para 2 Pessoas",
    categoria: "sarapatel",
    preco: 45,
    imagem: "assets/img/sarapatel.webp",
    descricao: "Acompanha arroz.",
    opcoes: []
  },

  // =========================
  // CHURRASCO
  // =========================
  {
    id: 54,
    nome: "Churrasco Individual sem Frango",
    categoria: "churrasco",
    preco: 25,
    imagem: "assets/img/churrasco.png",
    descricao: "Acompanha arroz, feijão tropeiro e salada.",
    opcoes: []
  },
  {
    id: 55,
    nome: "Churrasco Individual com Frango",
    categoria: "churrasco",
    preco: 30,
    imagem: "assets/img/churrasco.png",
    descricao: "Acompanha arroz, feijão tropeiro e salada.",
    opcoes: []
  },
  {
    id: 56,
    nome: "Churrasco para 2 Pessoas",
    categoria: "churrasco",
    preco: 45,
    imagem: "assets/img/churrasco.png",
    descricao: "Acompanha arroz, feijão tropeiro e salada. Serve 2 pessoas.",
    opcoes: []
  },

  // =========================
  // PORÇÕES — GUARNIÇÕES E PROTEÍNAS
  // =========================
  {
    id: 71,
    nome: "Porção de Arroz",
    categoria: "porcao_guarnicao",
    preco: 5,
    imagem: "assets/img/arroz.jpg",
    descricao: "Porção avulsa de arroz.",
    opcoes: []
  },
  {
    id: 72,
    nome: "Porção de Feijão",
    categoria: "porcao_guarnicao",
    preco: 10,
    imagem: "assets/img/feijao.jpg",
    descricao: "Porção avulsa de feijão.",
    opcoes: []
  },
  {
    id: 73,
    nome: "Porção de Macarrão",
    categoria: "porcao_guarnicao",
    preco: 7,
    imagem: "assets/img/macarrao.jpg",
    descricao: "Porção avulsa de macarrão.",
    opcoes: []
  },
  {
    id: 75,
    nome: "Porção de Carne",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/bife-carne.jpg",
    descricao: "Porção avulsa de carne.",
    opcoes: []
  },
  {
    id: 76,
    nome: "Porção de Assado de Boi",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/assado-boi.jpg",
    descricao: "Porção avulsa de assado de boi.",
    opcoes: []
  },
  {
    id: 77,
    nome: "Porção de Frango Frito",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/frango-frito.jpg",
    descricao: "Porção avulsa de frango frito.",
    opcoes: []
  },
  {
    id: 78,
    nome: "Porção de Frango Assado",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/frango-assado.jpg",
    descricao: "Porção avulsa de frango assado.",
    opcoes: []
  },
  {
    id: 79,
    nome: "Porção de Frango Ensopado",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/ensfrango.jpg",
    descricao: "Porção avulsa de frango ensopado.",
    opcoes: []
  },
  {
    id: 80,
    nome: "Porção de Ensopado de Boi",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/ensboi.jpg",
    descricao: "Porção avulsa de ensopado de boi.",
    opcoes: []
  },
  {
    id: 81,
    nome: "Porção de Filé de Frango Empanado",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/frango-empanado.jpg",
    descricao: "Porção avulsa de filé de frango empanado.",
    opcoes: []
  },
  {
    id: 82,
    nome: "Porção de Filé de Frango Acebolado",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/frango-acebolado.jpg",
    descricao: "Porção avulsa de filé de frango acebolado.",
    opcoes: []
  },
  {
    id: 83,
    nome: "Porção de Bife de Carne Acebolado",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/bife-carne.jpg",
    descricao: "Porção avulsa de bife de carne acebolado.",
    opcoes: []
  },
  {
    id: 84,
    nome: "Porção de Bife de Carne ao Molho",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/bife-molho.jpg",
    descricao: "Porção avulsa de bife de carne ao molho.",
    opcoes: []
  },
  {
    id: 85,
    nome: "Porção de Carne do Sol",
    categoria: "porcao_proteina",
    preco: 15,
    imagem: "assets/img/carne-sol.jpg",
    descricao: "Porção avulsa de carne do sol.",
    opcoes: []
  },

  // =========================
  // PETISCOS
  // =========================
  {
    id: 70,
    nome: "Batata Frita",
    categoria: "petisco",
    preco: 25,
    imagem: "assets/img/batata-frita.jpg",
    descricao: "Batata frita crocante.",
    opcoes: []
  },
  {
    id: 74,
    nome: "Batata Frita com Carne do Sol",
    categoria: "petisco",
    preco: 55,
    imagem: "assets/img/batata_carne_sol.webp",
    descricao: "Batata frita servida com carne do sol.",
    opcoes: []
  },
  {
    id: 86,
    nome: "Filé com Fritas",
    categoria: "petisco",
    preco: 50,
    imagem: "assets/img/file-com-fritas.jpg",
    descricao: "Filé servido com batata frita.",
    opcoes: []
  },

  // =========================
  // SOBREMESAS
  // =========================
  {
    id: 60,
    nome: "Pudim",
    categoria: "sobremesa",
    preco: 10,
    imagem: "assets/img/pudim.jpg",
    descricao: "Mini pudim.",
    opcoes: []
  },
  {
    id: 61,
    nome: "Mousse",
    categoria: "sobremesa",
    preco: 8,
    imagem: "assets/img/mousse-maracuja.jpg",
    descricao: "Mousse.",
    opcoes: []
  },

  // =========================
  // BEBIDAS — NÃO ALCOÓLICAS
  // =========================
  {
    id: 100,
    nome: "Suco de Frutas",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 3,
    imagem: "assets/img/suco.jpg",
    descricao: "Escolha o sabor e o tamanho: 200 ml por R$ 3,00 ou 300 ml por R$ 4,00.",
    opcoes: opcoesSuco()
  },
  {
    id: 102,
    nome: "Refrigerante 1 L",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 10,
    imagem: "assets/img/garrafa-1l.jpg",
    descricao: "Refrigerante de 1 litro. Escolha a marca disponível.",
    opcoes: opcoesRefrigerante1L()
  },
  {
  id: 127,
  nome: "Coca-Cola KS",
  categoria: "bebida",
  subcategoria: "nao_alcoolica",
  preco: 6,
  imagem: "assets/img/coca-ks-290ml.webp",
  descricao: "Escolha o tamanho da Coca-Cola.",
  opcoes: opcoesCocaKS()
},
  {
    id: 103,
    nome: "Refrigerante Lata",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 6,
    imagem: "assets/img/refrigerante-lata.jpg",
    descricao: "Refrigerante em lata. Escolha a marca disponível.",
    opcoes: opcoesRefrigeranteLata()
  },
  {
  id: 128,
  nome: "Refrigerante IT Lata",
  categoria: "bebida",
  subcategoria: "nao_alcoolica",
  preco: 5,
  imagem: "assets/img/refrigerante-it-lata.webp",
  descricao: "Refrigerante IT em lata.",
  opcoes: []
},
  {
    id: 116,
    nome: "Red Bull Lata",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 12,
    imagem: "assets/img/red-bull.webp",
    descricao: "Energético Red Bull em lata.",
    opcoes: []
  },
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
    nome: "Água Mineral com Gás",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 5,
    imagem: "assets/img/agua-gas.jpg",
    descricao: "Água mineral com gás.",
    opcoes: []
  },
  {
    id: 117,
    nome: "Cerveja sem Álcool",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 8,
    imagem: "assets/img/cerveja-sem-alcool.webp",
    descricao: "Escolha entre Itaipava, Black Princess e Império, conforme disponibilidade.",
    opcoes: opcoesCervejaSemAlcool()
  },
  {
    id: 125,
    nome: "Refrigerante Copo",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 4,
    imagem: "assets/img/refri-copo.jpg",
    descricao: "Refrigerante servido no copo.",
    opcoes: []
  },
  {
    id: 109,
    nome: "Café",
    categoria: "bebida",
    subcategoria: "nao_alcoolica",
    preco: 0.5,
    imagem: "assets/img/cafe.jpg",
    descricao: "Escolha a opção de café e o tamanho.",
    opcoes: opcoesCafe()
  },

  // =========================
  // EMBALAGENS
  // =========================
  {
    id: 126,
    nome: "Quentinha",
    categoria: "embalagem",
    preco: 2,
    imagem: "assets/img/quentinha.jpg",
    descricao: "Embalagem para viagem.",
    opcoes: []
  },

  // =========================
  // CERVEJAS — LONG NECK E 600 ML
  // =========================
  {
    id: 106,
    nome: "Heineken Long Neck",
    categoria: "cerveja_long_neck",
    subcategoria: "alcoolica",
    preco: 10,
    imagem: "assets/img/heineken.jpg",
    descricao: "Heineken long neck gelada.",
    opcoes: []
  },
  {
    id: 104,
    nome: "Império Long Neck",
    categoria: "cerveja_long_neck",
    subcategoria: "alcoolica",
    preco: 8,
    imagem: "assets/img/imperio.jpg",
    descricao: "Império long neck gelada.",
    opcoes: []
  },
  {
    id: 110,
    nome: "51 Ice Long Neck",
    categoria: "cerveja_long_neck",
    subcategoria: "alcoolica",
    preco: 12,
    imagem: "assets/img/ice_long.webp",
    descricao: "51 Ice long neck gelada.",
    opcoes: []
  },
  {
    id: 111,
    nome: "Heineken 600 ml",
    categoria: "cerveja_600",
    subcategoria: "alcoolica",
    preco: 18,
    imagem: "assets/img/heineken.jpg",
    descricao: "Heineken 600 ml gelada.",
    opcoes: []
  },
  {
    id: 112,
    nome: "Amstel 600 ml",
    categoria: "cerveja_600",
    subcategoria: "alcoolica",
    preco: 13,
    imagem: "assets/img/amstel_600.webp",
    descricao: "Amstel 600 ml gelada.",
    opcoes: []
  },
  {
    id: 114,
    nome: "Itaipava 600 ml",
    categoria: "cerveja_600",
    subcategoria: "alcoolica",
    preco: 10,
    imagem: "assets/img/itaipava_600.jpg",
    descricao: "Itaipava 600 ml gelada.",
    opcoes: []
  },
  {
    id: 113,
    nome: "Schin 600 ml",
    categoria: "cerveja_600",
    subcategoria: "alcoolica",
    preco: 8,
    imagem: "assets/img/schin_600.jpg",
    descricao: "Schin 600 ml gelada.",
    opcoes: []
  },

  // =========================
  // DOSES
  // =========================
  {
    id: 120,
    nome: "Dose de Pitú",
    categoria: "dose",
    subcategoria: "alcoolica",
    preco: 5,
    imagem: "assets/img/dose-pitu.webp",
    descricao: "Dose de Pitú.",
    opcoes: []
  },
  {
    id: 121,
    nome: "Dose de Conhaque",
    categoria: "dose",
    subcategoria: "alcoolica",
    preco: 5,
    imagem: "assets/img/dose-conhaque.webp",
    descricao: "Dose de conhaque.",
    opcoes: []
  },
  {
    id: 122,
    nome: "Dose de Vodka",
    categoria: "dose",
    subcategoria: "alcoolica",
    preco: 5,
    imagem: "assets/img/dose-vodka.png",
    descricao: "Dose de vodka.",
    opcoes: []
  },
  {
    id: 123,
    nome: "Dose de Seleta",
    categoria: "dose",
    subcategoria: "alcoolica",
    preco: 7,
    imagem: "assets/img/dose-seleta.webp",
    descricao: "Dose de Seleta.",
    opcoes: []
  },
  {
    id: 124,
    nome: "Dose de Alcatrão",
    categoria: "dose",
    subcategoria: "alcoolica",
    preco: 5,
    imagem: "assets/img/dose-alcatrao.webp",
    descricao: "Dose de Alcatrão.",
    opcoes: []
  }

];

function opcoesComidaBaiana() {
  return [
    {
      titulo: "Proteína",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 proteína",
      itens: [
        { nome: "Moqueca de Peixe", imagem: "assets/img/moq-peixe.jpg" },
        { nome: "Moqueca de Marisco", imagem: "assets/img/moqueca-marisco.jpg" },
        { nome: "Peixe Frito", imagem: "assets/img/peixe-frito.jpg" },
        { nome: "Xinxim de Frango", imagem: "assets/img/xinxim-frango.jpg" }
      ]
    }
  ];
}

function opcoesCafe() {
  return [
    {
      titulo: "Opção de café",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 opção",
      itens: [
        { nome: "Café preto mini — 50 ml", imagem: "assets/img/cafe-puro.jpg", precoVariacao: 0.5 },
        { nome: "Café preto médio — 200 ml", imagem: "assets/img/cafe-puro.jpg", precoVariacao: 3 },
        { nome: "Café com leite médio — 200 ml", imagem: "assets/img/cafe-com-leite2.jpg", precoVariacao: 4 }
      ]
    }
  ];
}

function opcoesCafeDaManha() {
  return [
    {
      titulo: "Proteína",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 proteína",
      itens: [
        { nome: "Ovos", imagem: "assets/img/ovo-frito.jpg", precoVariacao: 15 },
        { nome: "Ensopado de boi", imagem: "assets/img/ensboi.jpg", precoVariacao: 15 },
        { nome: "Ensopado de frango", imagem: "assets/img/ensfrango.jpg", precoVariacao: 15 },
        { nome: "Carne de sertão frita", imagem: "assets/img/carne-sertao-frita.png", precoVariacao: 18 }
      ]
    }
  ];
}

function opcoesSuco() {
  return [
    {
      titulo: "Sabor",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 sabor",
      itens: [
        { nome: "Graviola", imagem: "assets/img/sucobranco.jpg" },
        { nome: "Cajá", imagem: "assets/img/sucoamarelo.jpg" },
        { nome: "Caju", imagem: "assets/img/sucobranco.jpg" },
        { nome: "Umbu", imagem: "assets/img/sucobranco.jpg" }
      ]
    },
    {
      titulo: "Tamanho",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 tamanho",
      itens: [
        { nome: "200 ml", imagem: "assets/img/copo-300ml.jpg", precoVariacao: 3 },
        { nome: "300 ml", imagem: "assets/img/copo-300ml.jpg", precoVariacao: 4 }
      ]
    }
  ];
}

function opcoesRefrigerante1L() {
  return [
    {
      titulo: "Marca",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 opção",
      itens: [
        { nome: "Pepsi", imagem: "assets/img/pepsi.jpg" },
        { nome: "Coca-Cola Zero", imagem: "assets/img/coca-zero.jpg" }
      ]
    }
  ];
}

function opcoesRefrigeranteLata() {
  return [
    {
      titulo: "Marca",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 opção",
      itens: [
        { nome: "Sprite Zero", imagem: "assets/img/sprite-zero.jpg" },
        { nome: "Coca-Cola Zero", imagem: "assets/img/coca-zero.jpg" },
        { nome: "Pepsi", imagem: "assets/img/pepsi.jpg" }
      ]
    }
  ];
}

function opcoesCocaKS() {
  return [
    {
      titulo: "Tamanho",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 tamanho",
      itens: [
        {
          nome: "290 ml",
          imagem: "assets/img/coca-ks-290ml.webp",
          precoVariacao: 6
        },
        {
          nome: "1 Litro",
          imagem: "assets/img/coca-ks-1l.webp",
          precoVariacao: 12
        }
      ]
    }
  ];
}

function opcoesCervejaSemAlcool() {
  return [
    {
      titulo: "Marca",
      tipo: "radio",
      obrigatorio: true,
      subtitulo: "Escolha 1 opção",
      itens: [
        { nome: "Itaipava", imagem: "assets/img/cerveja-sem-alcool.webp" },
        { nome: "Black Princess", imagem: "assets/img/cerveja-sem-alcool.webp" },
        { nome: "Império", imagem: "assets/img/imperio.jpg" }
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
