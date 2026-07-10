# Mets — Avaliação Integrada de Estilo de Vida (versão web)

Site estático (HTML/CSS/JavaScript) hospedado de graça no GitHub Pages, com banco
de dados gratuito no Firebase (Firestore) e login protegido (Firebase Authentication).
Sem servidor próprio, sem custo além de um domínio (opcional).

**Importante — dados de saúde:** este sistema armazena dados sensíveis (inclusive
de menores de idade). Siga as instruções de Regras de Segurança abaixo à risca —
elas são o que impede qualquer pessoa não autenticada de ler ou escrever no banco.

---

## Passo 1 — Criar o projeto no Firebase (gratuito)

1. Acesse https://console.firebase.google.com e clique em **"Adicionar projeto"**.
2. Dê um nome (ex.: `mets-avaliacao`) e siga o assistente (pode desativar o Google
   Analytics, não é necessário).
3. Dentro do projeto, vá em **Compilação > Authentication** → "Vamos começar" →
   ative o provedor **Google**. Escolha um e-mail de suporte do projeto (pode ser
   o seu mesmo) e salve.
4. Vá em **Compilação > Firestore Database** → "Criar banco de dados" → escolha o
   modo **produção** → selecione uma região (ex.: `southamerica-east1` — São Paulo).

Não é necessário cadastrar usuário manualmente — o login é feito com a sua própria
conta Google. A restrição de acesso (só você entrar) é feita no Passo 2, abaixo.

## Passo 2 — Configurar as Regras de Segurança do Firestore

⚠️ **Este passo é ainda mais importante com login via Google**, porque qualquer
pessoa com conta Google consegue *tentar* entrar — quem garante que só você
acessa os dados são estas regras (não o código do site).

Na aba **Regras** do Firestore, substitua o conteúdo por (troque o e-mail pelo seu):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null
                          && request.auth.token.email == 'SEU_EMAIL_AQUI@gmail.com';
    }
  }
}
```

Clique em "Publicar". Agora, mesmo que outra pessoa faça login com o Google dela
no seu site, o Firestore vai recusar qualquer leitura/escrita — a tela vai abrir,
mas vazia e sem conseguir salvar nada.

**Você também precisa editar o arquivo `js/app.js`** e trocar:
```js
const EMAIL_AUTORIZADO = "SEU_EMAIL_AQUI@gmail.com";
```
pelo mesmo e-mail que você usou nas regras acima. Essa checagem no código é só
para mostrar uma mensagem amigável e deslogar automaticamente quem não for você
— a proteção de verdade é a regra do Firestore.

## Passo 3 — Pegar as chaves do projeto

1. No menu, clique na engrenagem ⚙️ → **Configurações do projeto**.
2. Em "Seus aplicativos", clique no ícone **`</>`** (Web) para registrar um app.
3. Dê um apelido (ex.: `mets-web`) e clique em "Registrar app" (não precisa marcar
   Firebase Hosting).
4. Copie o objeto `firebaseConfig` que aparece — vai parecer com isto:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mets-avaliacao.firebaseapp.com",
  projectId: "mets-avaliacao",
  storageBucket: "mets-avaliacao.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. Abra o arquivo **`js/firebase-config.js`** neste projeto e cole os valores
   correspondentes no lugar de `"COLE_AQUI"`.

Essas chaves não são segredo — qualquer app Firebase do lado do cliente expõe
essas mesmas informações. A segurança de verdade vem do login obrigatório (Passo 2).

## Passo 4 — Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser privado ou público — como são só
   arquivos de interface, não há problema em ser público; os dados ficam no
   Firebase, não no repositório).
2. Suba todos os arquivos desta pasta (`index.html`, `css/`, `js/`, `assets/`)
   para o repositório — do jeito que você já fez com o site do casamento.
3. No repositório, vá em **Settings > Pages**.
4. Em "Source", selecione a branch (ex.: `main`) e a pasta `/ (root)`.
5. Salve. Em alguns minutos o site estará no ar em
   `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/`.
6. (Opcional) Em "Custom domain", aponte um domínio próprio que você tenha
   comprado — é a única etapa que envolve custo.

⚠️ **Depois de publicar, falta autorizar esse endereço no Firebase**, senão o
login com Google vai dar erro de "domínio não autorizado":
1. Copie o endereço do seu site (ex.: `seu-usuario.github.io`).
2. No Firebase: **Authentication → Settings → Authorized domains → Add domain**.
3. Cole o endereço (sem `https://`, só o domínio) e salve.

## Como usar no dia a dia

1. Acesse o link do site e clique em **"Entrar com Google"**, usando a conta
   autorizada.
2. Aba **Pacientes**: cadastre o aluno.
3. Aba **Nova Avaliação**: selecione o paciente, use "Carregar dados anteriores"
   se já houver histórico, preencha o formulário e clique em
   "Calcular e Salvar Avaliação".
4. Aba **Histórico / Relatório**: selecione o paciente, "Carregar histórico" e
   "Gerar Relatório (PDF)" — abre uma nova aba já formatada; use **Ctrl+P**
   (ou o botão "Imprimir / Salvar como PDF" no topo) e escolha "Salvar como PDF"
   no destino da impressão.

## Estrutura do projeto

```
mets-avaliacao/
├── index.html              → login + shell da aplicação (single-page app)
├── css/style.css            → identidade visual (azul-marinho da marca)
├── js/
│   ├── firebase-config.js    → suas chaves do Firebase (preencher no Passo 3)
│   ├── db.js                  → autenticação + leitura/escrita no Firestore
│   ├── formulario.js           → perguntas + lógica de pontuação (mesma do app Python)
│   ├── ui-form.js               → gera o HTML do formulário e lê os valores
│   ├── relatorio.js              → classificações por domínio + radar (SVG)
│   ├── relatorio-view.js          → monta a página do relatório para impressão/PDF
│   └── app.js                      → conecta tudo (abas, eventos, fluxo)
└── assets/logo_mets.png
```

## Testando localmente antes de publicar

Navegadores bloqueiam módulos JavaScript (`type="module"`) abertos diretamente como
arquivo (`file://`). Para testar no seu computador antes de publicar, rode um
servidor local simples dentro da pasta do projeto:

```
python3 -m http.server 8000
```

E acesse `http://localhost:8000` no navegador. (Depois de publicado no GitHub
Pages isso não é mais necessário — o site já serve os arquivos corretamente.)

## Diferenças em relação ao app Python local

- **Precisa de internet** para funcionar (tanto para carregar o site quanto para
  ler/gravar no Firestore) — deixou de ser 100% offline.
- **Acessível de qualquer dispositivo** com navegador (celular, tablet, outro
  computador), não só da máquina onde estava instalado.
- **Backup automático**: os dados ficam no Firebase, não dependem de um único
  arquivo local.
- **Relatório em PDF** (via impressão do navegador) em vez de `.docx` editável.
- Custo: **gratuito** dentro dos limites do plano Spark do Firebase (bem acima do
  que um estúdio pequeno usa) + GitHub Pages gratuito. Only paga se decidir comprar
  um domínio próprio.

## Limitações / avisos

- Sono, screener alimentar e o módulo de trabalho continuam sendo instrumentos
  internos, não validados externamente — mesma ressalva do app anterior.
- PSQI e WHOQOL-bref permanecem fora por questão de direitos autorais (ver
  decisões anteriores do projeto).
- Login único — pensado para uso por uma pessoa (você). Se no futuro mais gente
  precisar de acesso, dá para criar mais usuários no Firebase Authentication
  sem mudar o código.
