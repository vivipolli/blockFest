import * as StellarSdk from "@stellar/stellar-sdk";

/**
 * Analisa os eventos de uma transação Soroban e extrai informações legíveis
 * @param {Object} resultMetaXdr - O objeto resultMetaXdr da resposta da transação
 * @returns {Array} - Array de eventos analisados em formato legível
 */
export function parseTransactionEvents(resultMetaXdr) {
  try {
    const events = resultMetaXdr.v3().sorobanMeta().events();
    const parsedEvents = [];

    for (let i = 0; i < events.length; i++) {
      try {
        const event = events[i];
        const eventType = event.type().toString();

        const parsedEvent = {
          type: eventType,
          topics: [],
          data: [],
        };

        if (eventType === "contract") {
          const topics = event.body().v0().topics();

          for (let j = 0; j < topics.length; j++) {
            try {
              parsedEvent.topics.push(topics[j].toString());
            } catch (e) {
              parsedEvent.topics.push(`[Error parsing topic: ${e.message}]`);
            }
          }

          const data = event.body().v0().data();

          for (let j = 0; j < data.length; j++) {
            try {
              if (data[j].switch().name === "scvAddress") {
                parsedEvent.data.push(
                  StellarSdk.StrKey.encodeEd25519PublicKey(
                    data[j].address().value()
                  )
                );
              } else if (data[j].switch().name === "scvI128") {
                parsedEvent.data.push(data[j].i128().lo().toString());
              } else {
                parsedEvent.data.push(data[j].toString());
              }
            } catch (e) {
              parsedEvent.data.push(`[Error parsing data: ${e.message}]`);
            }
          }
        }

        parsedEvents.push(parsedEvent);
      } catch (e) {
        parsedEvents.push({
          error: `Error processing event: ${e.message}`,
        });
      }
    }

    return parsedEvents;
  } catch (e) {
    return [
      {
        error: `Error parsing transaction events: ${e.message}`,
      },
    ];
  }
}

/**
 * Encontra o token ID em um evento de mint
 * @param {Array} parsedEvents - Array de eventos analisados
 * @returns {Number|null} - O token ID encontrado ou null se não encontrado
 */
export function findTokenIdInMintEvent(parsedEvents) {
  for (const event of parsedEvents) {
    if (
      event.type === "contract" &&
      event.topics.includes("Mint") &&
      event.data.length > 1
    ) {
      return parseInt(event.data[1]);
    }
  }
  return null;
}
