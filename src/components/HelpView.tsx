import React from 'react';
import { Box, Text } from 'ink';

interface HelpViewProps {
  onClose: () => void;
  maxHeight?: number;
}

export const HelpView: React.FC<HelpViewProps> = ({ onClose, maxHeight }) => {
  return (
    <Box
      flexDirection="column"
      padding={1}
      height={maxHeight}
      overflow="hidden"
    >
      <Box marginBottom={1}>
        <Text bold color="yellow">
          ╔════════════════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text bold color="yellow">║</Text>
        <Text bold color="cyan">        📖 AJUDA - Atalhos              </Text>
        <Text bold color="yellow">║</Text>
      </Box>
      <Box marginBottom={1}>
        <Text bold color="yellow">
          ╚════════════════════════════════════════╝
        </Text>
      </Box>

      <Box flexDirection="column" marginLeft={2} flexGrow={1} overflow="hidden">
        <Text bold color="cyan">Navegação:</Text>
        <Text>  <Text color="white">↑ / k</Text>     <Text color="gray">Tarefa anterior</Text></Text>
        <Text>  <Text color="white">↓ / j</Text>     <Text color="gray">Próxima tarefa</Text></Text>
        <Text>  <Text color="white">← / h</Text>     <Text color="gray">Seção anterior</Text></Text>
        <Text>  <Text color="white">→ / l</Text>     <Text color="gray">Próxima seção</Text></Text>
        <Text>  <Text color="white">Tab</Text>       <Text color="gray">Próxima seção</Text></Text>

        <Box marginTop={1}>
          <Text bold color="cyan">Seleção (multi-tarefa):</Text>
        </Box>
        <Text>  <Text color="white">Espaço</Text>    <Text color="gray">Selecionar/desselecionar tarefa</Text></Text>
        <Text>  <Text color="white">s</Text>         <Text color="gray">Toggle seleção do grupo atual</Text></Text>
        <Text>  <Text color="white">S</Text>         <Text color="gray">Toggle seleção de TODAS as tarefas</Text></Text>

        <Box marginTop={1}>
          <Text bold color="cyan">Ações:</Text>
        </Box>
        <Text>  <Text color="white">Enter</Text>     <Text color="gray">Concluir (selecionadas ou atual)</Text></Text>
        <Text>  <Text color="white">a</Text>         <Text color="gray">Adicionar nova tarefa</Text></Text>
        <Text>  <Text color="white">e</Text>         <Text color="gray">Editar tarefa atual</Text></Text>
        <Text>  <Text color="white">f</Text>         <Text color="gray">Editar foco do dia</Text></Text>
        <Text>  <Text color="white">d</Text>         <Text color="gray">Deletar (selecionadas ou atual)</Text></Text>
        <Text>  <Text color="white">m</Text>         <Text color="gray">Mover (selecionadas ou atual)</Text></Text>
        <Text>  <Text color="white">K</Text>         <Text color="gray">Mover tarefa(s) para cima/grupo anterior</Text></Text>
        <Text>  <Text color="white">J</Text>         <Text color="gray">Mover tarefa(s) para baixo/próximo grupo</Text></Text>

        <Box marginTop={1}>
          <Text bold color="cyan">Mover rápido (números):</Text>
        </Box>
        <Text>  <Text color="white">1</Text> Fazendo  <Text color="white">2</Text> Próximas  <Text color="white">3</Text> Esperando</Text>
        <Text>  <Text color="white">4</Text> Bloqueadas  <Text color="white">5</Text> Ideias  <Text color="white">0</Text> Concluídas</Text>

        <Box marginTop={1}>
          <Text bold color="cyan">Geral:</Text>
        </Box>
        <Text>  <Text color="white">r</Text>         <Text color="gray">Recarregar arquivo</Text></Text>
        <Text>  <Text color="white">?</Text>         <Text color="gray">Mostrar/Esconder ajuda</Text></Text>
        <Text>  <Text color="white">q / Esc</Text>   <Text color="gray">Sair / Fechar</Text></Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray" italic>Pressione qualquer tecla para fechar...</Text>
      </Box>
    </Box>
  );
};
