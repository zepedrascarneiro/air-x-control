# Dashboard Air X

Visão direcionada a administradores/comandantes para apresentar aos coproprietários da aeronave os principais indicadores operacionais. Proprietários/passageiros acessam o mesmo painel em modo somente leitura.

## Métricas Prioritárias

- **Resumo de Frota**: total de aeronaves ativas, status e horas totais acumuladas.
- **Utilização Recente**: quantidade de voos e horas voadas nos últimos 30 dias.
- **Agenda Próxima**: próximos voos agendados com origem/destino, piloto e encargos previstos.
- **Top Gastos Operacionais**: ranking das maiores despesas recentes e custo total no período.
- **KPIs Financeiros**: custo médio por hora, absorções base/fixa e saldo de despesas pendentes.

## Layout

1. **Cards de Destaque** no topo (resumo de frota, horas voadas, custo acumulado, taxa de ocupação).
2. **Seção de Próximos Voos** em tabela simples com data/hora, rota, piloto e status.
3. **Painel Financeiro** com tabela de despesas recentes e destaque para categorias críticas.
4. **Histórico Resumido** com voos concluídos recentemente e notas relevantes.

## Princípios

- Visual limpo, cores alinhadas à identidade Air X.
- Texto direto, sem excesso de jargão técnico.
- Informações suficientes para esclarecer a operação em uma reunião rápida.

## Jornada do Administrador / Comandante

1. **Cadastrar aeronaves** na aba “Aeronaves” da *Central do Administrador / Comandante* (prefixo, modelo, status e próxima manutenção). Sem aeronaves cadastradas, os formulários de voo permanecem indisponíveis.
2. **Criar ou atualizar voos** na aba “Voos”, selecionando as aeronaves cadastradas e registrando horas, absorções e responsáveis.
3. **Registrar despesas operacionais** na aba “Despesas”, vinculando cada gasto a um voo quando aplicável.
4. **Usar filtros persistentes** para compartilhar links específicos de voos ou despesas com proprietários/passageiros.
5. **Revisar o dashboard principal** para validar impactos das atualizações em métricas de frota, agenda e finanças.

## Jornada do Proprietário / Passageiro

1. Acessar o dashboard para visualizar métricas consolidadas e próximos voos.
2. Aplicar filtros compartilhados pelo administrador/comandante para encontrar rapidamente voos ou despesas relevantes.
3. Registrar anotações locais ou solicitar ajustes diretamente à equipe operacional (fora do app).
