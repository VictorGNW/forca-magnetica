# Força Magnética — Simulador 3D Interativo

Projeto escolar de Física sobre a **força magnética em um condutor reto** e o **movimento de uma carga em um campo magnético uniforme**.

## 🌐 Acessar o simulador

**[Abrir o simulador no Render](https://forca-magnetica.onrender.com)**

## Sobre o projeto

O site apresenta uma demonstração virtual com uma tira de alumínio, pilha, fios, garras e ímãs. A ideia é visualizar como a corrente elétrica e o campo magnético influenciam a direção da força sobre um condutor.

A maquete física do trabalho é **ilustrativa**. O simulador representa o experimento de forma virtual, sem necessidade de montar um circuito real.

## Como usar

1. Abra o site e use **Tocar a ligação** (ou a tecla **Espaço**) para simular a passagem de corrente.
2. Inverta a pilha ou os ímãs para observar a mudança de sentido da força.
3. Ajuste o número de pilhas, a intensidade do campo magnético e a velocidade da simulação.
4. Ative os vetores **B**, **i** e **F**, mude a vista da câmera ou reinicie.

O simulador também representa o aquecimento da tira e interrompe a ligação quando atinge o limite definido no modelo.

## Física envolvida

### 1. Carga em campo magnético uniforme

A intensidade da força magnética sobre uma carga em movimento é:

**F = |q| · v · B · sen(θ)**

Se a velocidade for perpendicular ao campo magnético, a trajetória pode ser circular, com raio:

**R = m · v / (|q| · B)**

A força é perpendicular à velocidade. Para uma carga negativa, o sentido da força é oposto ao indicado pela regra da mão direita aplicada a uma carga positiva.

### 2. Condutor reto em campo magnético uniforme

A intensidade da força sobre um trecho reto de fio percorrido por corrente é:

**F = B · i · L · sen(θ)**

- **B**: intensidade do campo magnético (tesla);
- **i**: corrente elétrica (ampère);
- **L**: comprimento do trecho dentro do campo (metro);
- **θ**: ângulo entre a corrente e o campo.

O sentido é dado pelo produto vetorial **F = i · L × B**. Inverter a corrente ou o campo inverte a força; inverter os dois mantém o sentido original.

## Arquivos

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura da página |
| `style.css` | Aparência e layout |
| `app.js` | Interatividade e simulação física |
| `model.js` | Dados compactados do modelo 3D |

O projeto usa **HTML, CSS, JavaScript e Three.js r128** carregado por CDN.

## Executar localmente

Baixe os quatro arquivos na mesma pasta e abra `index.html` em um navegador com acesso à internet. Se houver restrições ao abrir arquivos locais, execute um servidor HTTP local.

## Hospedagem

Publicado no **Render** como **Static Site**, usando a branch `main`, sem comando de build e com diretório de publicação `.`. Novos commits na branch principal acionam a publicação automática.

> **Observação:** é uma simulação didática, não um instrumento de medição. Os resultados dependem dos parâmetros e das simplificações do modelo.
