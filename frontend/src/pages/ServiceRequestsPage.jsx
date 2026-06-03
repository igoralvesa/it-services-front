import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout.jsx';
import { apiRequest } from '../utils/api.js';
import { addDaysToIsoDate, formatBrazilianCurrency, formatDateForBrazil, getTodayIsoDate } from '../utils/date.js';

function getSession() {
  return JSON.parse(localStorage.getItem('av2_session') || 'null');
}

function normalizeRequest(request) {
  return {
    id: request.id ?? `tmp-${Date.now()}`,
    orderDate: String(request.orderDate || '').slice(0, 10),
    requestNumber: request.requestNumber,
    serviceId: Number(request.serviceId),
    serviceName: request.serviceName,
    status: request.status,
    price: Number(request.price),
    expectedDate: String(request.expectedDate || '').slice(0, 10)
  };
}

function nextRequestNumber(rows) {
  const highest = rows.reduce((max, row) => {
    const number = Number(String(row.requestNumber).replace(/\D/g, ''));
    return Number.isFinite(number) && number > max ? number : max;
  }, 5000);
  return `REQ-${highest + 1}`;
}

export function ServiceRequestsPage() {
  const [session] = useState(getSession);
  const [client, setClient] = useState(session?.client || null);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedService = useMemo(
    () => services.find((service) => String(service.id) === String(selectedServiceId)),
    [services, selectedServiceId]
  );

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setMessage('');
      try {
        const [meData, servicesData, requestsData] = await Promise.all([
          apiRequest('/auth/me', { token: session?.token }),
          apiRequest('/services'),
          apiRequest(`/requests?login=${encodeURIComponent(session?.client?.email || '')}`, { token: session?.token })
        ]);
        setClient(meData.client);
        setServices(servicesData.services);
        setSelectedServiceId(String(servicesData.services[0]?.id || ''));
        setRequests(requestsData.requests.map(normalizeRequest));
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [session?.token, session?.client?.email]);

  function deleteLocalRequest(id) {
    setRequests((current) => current.filter((request) => request.id !== id));
    setMessage('Solicitação removida da lista. Clique em Atualizar solicitações para salvar no banco.');
  }

  function addLocalRequest(event) {
    event.preventDefault();
    if (!selectedService) return;
    const orderDate = getTodayIsoDate();
    const newRequest = {
      id: `tmp-${Date.now()}`,
      orderDate,
      requestNumber: nextRequestNumber(requests),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      status: 'EM ELABORAÇÃO',
      price: selectedService.price,
      expectedDate: addDaysToIsoDate(orderDate, selectedService.leadDays)
    };
    setRequests((current) => [...current, newRequest].sort((a, b) => a.orderDate.localeCompare(b.orderDate)));
    setMessage('Solicitação adicionada à lista. Clique em Atualizar solicitações para salvar no banco.');
  }

  async function saveRequests() {
    setIsSaving(true);
    setMessage('');
    try {
      await apiRequest('/requests', {
        method: 'PUT',
        token: session?.token,
        body: {
          login: client?.email,
          requests: requests.map(({ id, ...request }) => request)
        }
      });
      const data = await apiRequest(`/requests?login=${encodeURIComponent(client?.email || '')}`, { token: session?.token });
      setRequests(data.requests.map(normalizeRequest));
      setMessage('Solicitações atualizadas com sucesso.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout tagline="Solicitação de serviços de TI">
      <main className="site-main">
        <h1 className="page-title">Carrinho de solicitações de serviços</h1>
        <p className="text-muted">Organize solicitações de suporte, acompanhe prazos e consulte o histórico.</p>

        <section className="services-section card" aria-labelledby="user-panel-title">
          <h2 id="user-panel-title">Usuário logado</h2>
          <p><span className="readonly-label">Nome:</span>{client?.fullName || '-'}</p>
          <p><span className="readonly-label">Login (e-mail):</span>{client?.email || '-'}</p>
        </section>

        <section className="services-section" aria-labelledby="orders-title">
          <h2 id="orders-title">Solicitações já realizadas</h2>
          <p className="text-muted">Ordenadas pela data do pedido. Cada linha pode ser excluída antes da atualização.</p>
          <div className="table-scroll">
            <table className="table-requests">
              <thead>
                <tr>
                  <th>Data do pedido</th>
                  <th>Nº da solicitação</th>
                  <th>Serviço de TI</th>
                  <th>Status</th>
                  <th>Preço</th>
                  <th>Data prevista</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="7">Carregando...</td></tr>
                ) : requests.length === 0 ? (
                  <tr><td colSpan="7">Nenhuma solicitação cadastrada.</td></tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td>{formatDateForBrazil(request.orderDate)}</td>
                      <td>{request.requestNumber}</td>
                      <td>{request.serviceName}</td>
                      <td>{request.status}</td>
                      <td>{formatBrazilianCurrency(request.price)}</td>
                      <td>{formatDateForBrazil(request.expectedDate)}</td>
                      <td>
                        <button type="button" className="btn btn-secondary btn-row-delete" onClick={() => deleteLocalRequest(request.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="form-actions table-actions">
            <button type="button" className="btn btn-primary" onClick={saveRequests} disabled={isSaving || isLoading}>
              Atualizar solicitações
            </button>
          </div>
        </section>

        <section className="services-section card" aria-labelledby="new-request-title">
          <h2 id="new-request-title">Nova solicitação</h2>
          <form onSubmit={addLocalRequest} noValidate>
            <div className="form-group">
              <label htmlFor="service-select">Serviço de TI</label>
              <select id="service-select" value={selectedServiceId} onChange={(event) => setSelectedServiceId(event.target.value)}>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
            <p><span className="readonly-label">Preço:</span>{selectedService ? formatBrazilianCurrency(selectedService.price) : '-'}</p>
            <p><span className="readonly-label">Prazo de atendimento:</span>{selectedService ? `${selectedService.leadDays} dias` : '-'}</p>
            <p>
              <span className="readonly-label">Data prevista de atendimento:</span>
              {selectedService ? formatDateForBrazil(addDaysToIsoDate(getTodayIsoDate(), selectedService.leadDays)) : '-'}
            </p>
            <p><span className="readonly-label">Status:</span>EM ELABORAÇÃO</p>
            <button type="submit" className="btn btn-primary" disabled={!selectedService}>Incluir solicitação</button>
          </form>
        </section>

        {message ? <p className="status-message">{message}</p> : null}
      </main>
    </Layout>
  );
}
