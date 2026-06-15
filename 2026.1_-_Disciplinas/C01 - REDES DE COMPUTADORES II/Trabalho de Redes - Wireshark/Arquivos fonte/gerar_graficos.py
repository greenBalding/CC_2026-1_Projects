import os
import json
import matplotlib.pyplot as plt
import matplotlib
import numpy as np

# ==============================================================================
# CONFIGURAÇÃO
# ==============================================================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(BASE_DIR, "Prints", "5 - Estatísticas")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Carregar dados do JSON
with open(os.path.join(SCRIPT_DIR, "dados_estatisticas.json"), "r", encoding="utf-8") as f:
    dados = json.load(f)

# Configuração global de fontes
matplotlib.rcParams['font.family'] = 'Segoe UI'
plt.rcParams.update({
    'font.size': 12,
    'axes.titlesize': 15,
    'axes.labelsize': 12,
    'xtick.labelsize': 11,
    'ytick.labelsize': 11,
    'figure.titlesize': 16,
    'figure.facecolor': 'white',
    'axes.facecolor': '#FAFAFA',
    'axes.edgecolor': '#CCCCCC',
    'grid.color': '#E0E0E0',
    'grid.linestyle': '--',
    'grid.alpha': 0.7,
})

# Paleta de cores
CORES = {
    'TCP': '#2563EB',
    'UDP': '#F59E0B', 
    'ICMPv6': '#10B981',
    'ICMP': '#34D399',
    'IGMP': '#8B5CF6',
    'ARP': '#EF4444',
    'LLDP': '#6B7280',
    'Malformed': '#9CA3AF',
}

# ==============================================================================
# GRÁFICO 1: DISTRIBUIÇÃO DE PACOTES POR PROTOCOLO (Barras Horizontais)
# ==============================================================================
print("Gerando Gráfico 1...")

protocolos = ['TCP', 'UDP', 'ICMPv6', 'IGMP', 'ICMP', 'ARP', 'LLDP', 'Malformed']
pacotes = [1300, 626, 230, 44, 31, 26, 5, 13]
cores = [CORES[p] for p in protocolos]
total = sum(pacotes)

fig, ax = plt.subplots(figsize=(10, 5.5))

bars = ax.barh(protocolos, pacotes, color=cores, edgecolor='white', height=0.6, zorder=3)

for bar, pkt in zip(bars, pacotes):
    pct = pkt / total * 100
    label = f'  {pkt}  ({pct:.1f}%)'
    ax.text(bar.get_width() + 8, bar.get_y() + bar.get_height()/2,
            label, va='center', ha='left', fontsize=11, fontweight='600', color='#333333')

ax.invert_yaxis()
ax.set_xlabel('Quantidade de Pacotes', fontweight='bold', labelpad=12, fontsize=12)
ax.set_title(f'Distribuição de Pacotes por Protocolo\nTotal: {total:,} pacotes'.replace(',', '.'),
             fontweight='bold', pad=18, fontsize=14)

ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#CCCCCC')
ax.spines['bottom'].set_color('#CCCCCC')
ax.xaxis.grid(True, zorder=0)
ax.set_xlim(0, max(pacotes) + 250)
ax.tick_params(axis='y', labelsize=12, pad=5)

plt.tight_layout()
path1 = os.path.join(OUTPUT_DIR, 'grafico1_distribuicao_protocolos.png')
plt.savefig(path1, dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print(f"  -> Salvo: {path1}")


# ==============================================================================
# GRÁFICO 2: COMPARAÇÃO TCP vs UDP COM DETALHAMENTO IPv4/IPv6
# ==============================================================================
print("Gerando Gráfico 2...")

tcp_data = dados['resumo_por_transporte']['TCP']
udp_data = dados['resumo_por_transporte']['UDP']

categorias = ['TCP', 'UDP']
ipv4_vals = [tcp_data['ipv4'], udp_data['ipv4']]
ipv6_vals = [tcp_data['ipv6'], udp_data['ipv6']]
totais = [tcp_data['total'], udp_data['total']]

x = np.arange(len(categorias))
width = 0.32

fig, ax = plt.subplots(figsize=(8, 5.5))

bars_v6 = ax.bar(x - width/2, ipv6_vals, width, label='IPv6', color='#2563EB', edgecolor='white', zorder=3)
bars_v4 = ax.bar(x + width/2, ipv4_vals, width, label='IPv4', color='#60A5FA', edgecolor='white', zorder=3)

# Rótulos nas barras IPv6
for bar, val in zip(bars_v6, ipv6_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 12,
            f'{val}', ha='center', va='bottom', fontsize=11, fontweight='600', color='#1E40AF')

# Rótulos nas barras IPv4
for bar, val in zip(bars_v4, ipv4_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 12,
            f'{val}', ha='center', va='bottom', fontsize=11, fontweight='600', color='#3B82F6')

# Total acima de cada grupo
for i, tot in enumerate(totais):
    ax.text(i, max(ipv6_vals[i], ipv4_vals[i]) + 55,
            f'Total: {tot}', ha='center', va='bottom', fontsize=12, fontweight='bold', color='#1F2937',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#E5E7EB', edgecolor='none', alpha=0.8))

ax.set_ylabel('Quantidade de Pacotes', fontweight='bold', labelpad=12)
ax.set_title('Comparação de Tráfego: TCP vs UDP\n(Detalhamento por versão IP)', fontweight='bold', pad=18, fontsize=14)
ax.set_xticks(x)
ax.set_xticklabels(categorias, fontsize=13, fontweight='bold')
ax.legend(fontsize=11, loc='upper right', framealpha=0.9)

ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.yaxis.grid(True, zorder=0)
ax.set_ylim(0, max(max(ipv6_vals), max(ipv4_vals)) + 130)

plt.tight_layout()
path2 = os.path.join(OUTPUT_DIR, 'grafico2_tcp_vs_udp.png')
plt.savefig(path2, dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print(f"  -> Salvo: {path2}")


# ==============================================================================
# GRÁFICO 3: DISTRIBUIÇÃO POR VOLUME DE BYTES (Donut)
# ==============================================================================
print("Gerando Gráfico 3...")

# Protocolos de aplicação por bytes
app_labels = ['TLS/HTTPS', 'QUIC', 'DNS', 'ICMPv6', 'TCP (outros)', 'ICMP', 'Outros']
# TLS: 650793, QUIC: 248210, DNS: 8408, ICMPv6: 7520, 
# TCP headers: 26756 - already counted in TLS, so "TCP outros" = headers only
# ICMP: 1792, Outros: ARP(728) + IGMP(704) + LLDP(200) + SSDP(1185) + Data + rest
tls_bytes = 650793
quic_bytes = 248210
dns_bytes = 8408
icmpv6_bytes = 7520
icmp_bytes = 1792
outros_bytes = 728 + 704 + 200 + 1185 + 13286 + 160 + 82 + 45 + 90 + 200  # ARP+IGMP+LLDP+SSDP+Data+NetBIOS+mDNS+mDNS+LLDP
total_bytes = dados['total_bytes']
tcp_outros = total_bytes - tls_bytes - quic_bytes - dns_bytes - icmpv6_bytes - icmp_bytes - outros_bytes

app_sizes = [tls_bytes, quic_bytes, dns_bytes, icmpv6_bytes, tcp_outros, icmp_bytes, outros_bytes]
app_colors = ['#2563EB', '#7C3AED', '#F59E0B', '#10B981', '#60A5FA', '#34D399', '#9CA3AF']

fig, ax = plt.subplots(figsize=(8, 6))

wedges, texts, autotexts = ax.pie(
    app_sizes, labels=app_labels, colors=app_colors,
    autopct=lambda pct: f'{pct:.1f}%' if pct > 2 else '',
    pctdistance=0.78, startangle=90,
    wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2),
    textprops={'fontsize': 11, 'fontweight': '500'}
)

for autotext in autotexts:
    autotext.set_fontsize(10)
    autotext.set_fontweight('bold')
    autotext.set_color('white')

# Texto central
ax.text(0, 0, f'{total_bytes/1024/1024:.1f} MB\nTotal', ha='center', va='center',
        fontsize=14, fontweight='bold', color='#374151')

ax.set_title('Distribuição do Tráfego por Volume (Bytes)\nProtocolos de Aplicação',
             fontweight='bold', pad=20, fontsize=14)

plt.tight_layout()
path3 = os.path.join(OUTPUT_DIR, 'grafico3_distribuicao_bytes.png')
plt.savefig(path3, dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print(f"  -> Salvo: {path3}")


# ==============================================================================
# GRÁFICO 4: TABELA FORMATADA COMO IMAGEM
# ==============================================================================
print("Gerando Tabela...")

table_data = [
    ['TCP (Total)',       '1.300',  '57,1%',  '26.756',     '2,1%'],
    ['  - IPv6',          '845',    '37,1%',  '17.272',     '1,4%'],
    ['  - IPv4',          '455',    '20,0%',  '9.484',      '0,8%'],
    ['UDP (Total)',       '626',    '27,5%',  '5.008',      '0,4%'],
    ['  - IPv6',          '611',    '26,9%',  '4.888',      '0,4%'],
    ['  - IPv4',          '15',     '0,7%',   '120',        '0,0%'],
    ['ICMPv6',            '230',    '10,1%',  '7.520',      '0,6%'],
    ['IGMP',              '44',     '1,9%',   '704',        '0,1%'],
    ['ICMP',              '31',     '1,4%',   '1.792',      '0,1%'],
    ['ARP',               '26',     '1,1%',   '728',        '0,1%'],
    ['Malformed',         '13',     '0,6%',   '0',          '0,0%'],
    ['LLDP',              '5',      '0,2%',   '200',        '0,0%'],
    ['Total',             '2.275',  '100%',   '1.244.568',  '100%'],
]

col_labels = ['Protocolo', 'Pacotes', '% Pacotes', 'Bytes', '% Bytes']

fig, ax = plt.subplots(figsize=(10, 5.5))
ax.axis('off')

table = ax.table(
    cellText=table_data,
    colLabels=col_labels,
    loc='center',
    cellLoc='center',
    colWidths=[0.28, 0.16, 0.16, 0.20, 0.16]
)

table.auto_set_font_size(False)
table.set_fontsize(11)
table.scale(1.0, 1.6)

# Estilizar cabeçalho
for j in range(len(col_labels)):
    cell = table[0, j]
    cell.set_facecolor('#1E3A5F')
    cell.set_text_props(color='white', fontweight='bold', fontsize=12)
    cell.set_edgecolor('#15294A')

# Estilizar linhas
for i in range(1, len(table_data) + 1):
    for j in range(len(col_labels)):
        cell = table[i, j]
        cell.set_edgecolor('#D1D5DB')
        
        # Linha do Total
        if i == len(table_data):
            cell.set_facecolor('#E5E7EB')
            cell.set_text_props(fontweight='bold', fontsize=11)
        # Linhas de subtotal (TCP Total, UDP Total)
        elif i in [1, 4]:
            cell.set_facecolor('#EFF6FF')
            cell.set_text_props(fontweight='bold')
        # Sub-linhas (IPv4/IPv6)
        elif i in [2, 3, 5, 6]:
            cell.set_facecolor('#F8FAFC')
            cell.set_text_props(color='#6B7280')
        # Linhas normais alternadas
        elif i % 2 == 0:
            cell.set_facecolor('#FFFFFF')
        else:
            cell.set_facecolor('#F9FAFB')
    
    # Alinhar coluna de protocolo à esquerda
    table[i, 0].set_text_props(ha='left')
    table[i, 0]._loc = 'left'

ax.set_title('Tabela: Quantidade de Pacotes e Bytes por Protocolo',
             fontweight='bold', fontsize=14, pad=20, y=0.98)

plt.tight_layout()
path4 = os.path.join(OUTPUT_DIR, 'tabela_protocolos.png')
plt.savefig(path4, dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print(f"  -> Salvo: {path4}")


# ==============================================================================
# GRÁFICO 5: PROTOCOLOS DE APLICAÇÃO (Barras verticais)
# ==============================================================================
print("Gerando Gráfico 5...")

app_protos = ['QUIC', 'TLS (IPv6)', 'TLS (IPv4)', 'DNS', 'SSDP', 'mDNS']
app_pkt = [442, 271, 169, 88, 9, 2]
app_cores = ['#7C3AED', '#2563EB', '#60A5FA', '#F59E0B', '#EF4444', '#10B981']

fig, ax = plt.subplots(figsize=(9, 5.5))

bars = ax.bar(app_protos, app_pkt, color=app_cores, edgecolor='white', width=0.55, zorder=3)

for bar, val in zip(bars, app_pkt):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
            f'{val}', ha='center', va='bottom', fontsize=11, fontweight='bold', color='#333333')

ax.set_ylabel('Quantidade de Pacotes', fontweight='bold', labelpad=12)
ax.set_title('Pacotes por Protocolo de Aplicação', fontweight='bold', pad=18, fontsize=14)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.yaxis.grid(True, zorder=0)
ax.set_ylim(0, max(app_pkt) + 60)
ax.tick_params(axis='x', labelsize=11)

plt.tight_layout()
path5 = os.path.join(OUTPUT_DIR, 'grafico5_protocolos_aplicacao.png')
plt.savefig(path5, dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print(f"  -> Salvo: {path5}")


print("\n[OK] Todos os graficos e tabelas gerados com sucesso!")
print(f"   Diretorio: {OUTPUT_DIR}")
