import { Layout } from '../components/Layout.jsx';

export function HomePage() {
  return (
    <Layout tagline="Suporte, nuvem e segurança para empresas que precisam operar sem interrupções.">
      <main className="site-main">
        <h1 className="page-title">Conheça a Arrecifes Tecnologia</h1>
        <p id="page-intro" className="text-muted intro-text">
          A Arrecifes Tecnologia é uma empresa recifense de <mark>serviços de TI</mark> voltada para negócios que
          precisam de suporte confiável, infraestrutura segura e atendimento próximo.
        </p>

        <table className="layout-table">
          <tbody>
            <tr>
              <td>
                <section aria-labelledby="history-title">
                  <h2 id="history-title">Breve história</h2>
                  <p>
                    Fundada em 2018 no Recife, a Arrecifes Tecnologia nasceu para apoiar pequenas e médias empresas na
                    organização de redes, computadores, sistemas internos e serviços em nuvem.
                  </p>
                  <p className="text-muted">
                    O atendimento combina diagnóstico rápido, documentação simples e acompanhamento preventivo para
                    reduzir falhas recorrentes.
                  </p>
                </section>
              </td>
              <td className="layout-table__side">
                <section aria-labelledby="notes-title">
                  <h2 id="notes-title">Compromissos de atendimento</h2>
                  <div className="scroll-panel">
                    <p>
                      A central de suporte funciona de segunda a sexta, das 8h às 18h, com abertura de chamados por
                      WhatsApp, e-mail e painel do cliente.
                    </p>
                    <p>
                      Cada cliente recebe inventário dos equipamentos, histórico de chamados e recomendações mensais de
                      melhoria.
                    </p>
                    <p>
                      Projetos de nuvem são entregues com checklist de migração, validação de permissões, treinamento
                      básico da equipe e documentação.
                    </p>
                  </div>
                </section>
              </td>
            </tr>
          </tbody>
        </table>

        <section aria-labelledby="video-title">
          <h2 id="video-title">Vídeo institucional (streaming YouTube)</h2>
          <p className="text-muted">Apresentação em vídeo sobre atendimento, infraestrutura e segurança digital.</p>
          <div className="video-wrap">
            <iframe
              src="https://www.youtube.com/embed/und-czxHqR8"
              title="Vídeo institucional da Arrecifes Tecnologia"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <section aria-labelledby="gallery-title">
          <h2 id="gallery-title">Galeria — instalações e equipe</h2>
          <p className="text-muted">Registros ilustrativos de atendimento, infraestrutura e rotina técnica.</p>
          <div className="gallery">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" alt="Equipe técnica em reunião" />
            <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" alt="Infraestrutura de rede" />
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Service desk em operação" />
            <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80" alt="Equipe acompanhando projeto" />
          </div>
        </section>

        <section aria-labelledby="services-title">
          <h2 id="services-title">Principais serviços de TI</h2>
          <div className="layout-grid layout-grid--two">
            <div className="services-grid">
              <article className="card">
                <h3>Suporte e Service Desk</h3>
                <p>Atendimento remoto e presencial para computadores, impressoras, rede Wi-Fi e contas corporativas.</p>
              </article>
              <article className="card">
                <h3>Infraestrutura e nuvem</h3>
                <p>Implantação de backups, servidores, ambientes Microsoft 365, Google Workspace e monitoramento.</p>
              </article>
              <article className="card">
                <h3>Desenvolvimento sob demanda</h3>
                <p>Automação de planilhas, integração entre sistemas e pequenos portais internos.</p>
              </article>
            </div>
            <aside className="card" aria-label="Resumo">
              <h3>Destaque</h3>
              <p className="text-muted">
                O primeiro contato inclui levantamento do ambiente, priorização dos riscos e proposta objetiva.
              </p>
            </aside>
          </div>
        </section>

        <section aria-labelledby="founders-title">
          <h2 id="founders-title">Fundadores</h2>
          <table className="table-founders">
            <thead>
              <tr>
                <th scope="col">Cargo</th>
                <th scope="col">Nome</th>
                <th scope="col">Breve CV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Co-Founder</td>
                <td>Igor Almeida</td>
                <td>Especialista em gestão de serviços de TI e melhoria contínua.</td>
              </tr>
              <tr>
                <td>Co-Founder</td>
                <td>Victor Guilherme</td>
                <td>Arquiteto de infraestrutura com atuação em redes, servidores, nuvem e segurança.</td>
              </tr>
              <tr>
                <td>Head de Relacionamento</td>
                <td>John Doe</td>
                <td>Responsável por contratos, onboarding e satisfação pós-atendimento.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section aria-labelledby="contact-title">
          <h2 id="contact-title">Contato e localização</h2>
          <div className="layout-grid layout-grid--two">
            <div>
              <h3>Contatos</h3>
              <ul>
                <li>Telefone fixo: <a href="tel:+558135353535">(81) 3535-3535</a></li>
                <li>WhatsApp: <a href="https://wa.me/5581992464646" rel="noopener noreferrer">(81) 99246-4646</a></li>
                <li>E-mail: <a href="mailto:contato@arrecifes.com.br">contato@arrecifes.com.br</a></li>
              </ul>
            </div>
            <div>
              <h3>Endereço</h3>
              <p>Rua do Apolo, 235 — Sala 804 — Recife Antigo — Recife/PE — CEP 50030-220</p>
              <div className="payment-methods payment-methods--light">
                <figure>PIX</figure>
                <figure>Cartão</figure>
                <figure>Boleto</figure>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
