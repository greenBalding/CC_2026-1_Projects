import sys
from playwright.sync_api import sync_playwright

def rgb_to_hex(rgb_str):
    if not rgb_str.startswith('rgb'): return rgb_str
    try:
        parts = rgb_str.replace('rgba(','').replace('rgb(','').replace(')','').split(',')
        return "#{:02x}{:02x}{:02x}".format(int(parts[0]), int(parts[1]), int(parts[2]))
    except:
        return rgb_str

def scrape_site(url, output_file):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print(f"[{url}] Acessando site...")
        page.goto(url, wait_until='networkidle', timeout=60000)
        
        md_content = f"# Análise do Sistema Análogo: {url}\n\n"
        
        # 1. Título e Metadados
        title = page.title()
        md_content += f"**Título da Página:** {title}\n\n"
        
        # 2. Paleta de Cores
        print("Extraindo cores...")
        elements = page.query_selector_all('*')
        bg_colors = set()
        text_colors = set()
        
        # Pegar uma amostra limitando para não demorar demais
        for el in elements[:200]:
            try:
                bg = el.evaluate("e => getComputedStyle(e).backgroundColor")
                color = el.evaluate("e => getComputedStyle(e).color")
                if bg and bg != 'rgba(0, 0, 0, 0)' and bg != 'transparent':
                    bg_colors.add(rgb_to_hex(bg))
                if color and color != 'rgba(0, 0, 0, 0)':
                    text_colors.add(rgb_to_hex(color))
            except:
                pass
                
        md_content += "## 🎨 Paleta de Cores Identificada\n"
        md_content += "**Cores de Fundo:**\n" + ", ".join([f"`{c}`" for c in bg_colors]) + "\n\n"
        md_content += "**Cores de Texto:**\n" + ", ".join([f"`{c}`" for c in text_colors]) + "\n\n"
        
        # 3. Estrutura de Títulos (Seções)
        print("Extraindo estrutura de seções...")
        headings = page.locator('h1, h2, h3, h4').all()
        md_content += "## 📑 Seções (Headings)\n"
        for h in headings:
            tag_name = h.evaluate("e => e.tagName.toLowerCase()")
            text = h.inner_text().strip()
            if text:
                level = int(tag_name[1])
                indent = "  " * (level - 1)
                md_content += f"{indent}- **{tag_name.upper()}**: {text}\n"
        
        # 4. Links e Funcionalidades e Botões
        print("Extraindo botões e links principais...")
        buttons = page.locator('button, a.btn, [role="button"]').all()
        md_content += "\n## ⚙️ Funcionalidades e Call-to-Actions (Botões)\n"
        added_texts = set()
        for b in buttons:
            text = b.inner_text().strip().replace('\n', ' ')
            if text and len(text) < 50 and text not in added_texts:
                md_content += f"- {text}\n"
                added_texts.add(text)
                
        # Exportar arquivo
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(md_content)
        
        browser.close()
        print(f"Pronto! Arquivo markdown gerado: {output_file}")

if __name__ == '__main__':
    url = sys.argv[1] if len(sys.argv) > 1 else "https://www.apphealth.com.br/"
    out = sys.argv[2] if len(sys.argv) > 2 else "analise_site.md"
    scrape_site(url, out)
