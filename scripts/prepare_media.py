from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

Image.MAX_IMAGE_PIXELS = None


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "media"


def open_rgb(path: Path) -> Image.Image:
    return Image.open(path).convert("RGB")


def crop_fraction(image: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    left, top, right, bottom = box
    return image.crop(
        (
            round(image.width * left),
            round(image.height * top),
            round(image.width * right),
            round(image.height * bottom),
        )
    )


def save_webp(image: Image.Image, destination: Path, max_width: int = 2200, quality: int = 84) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.Resampling.LANCZOS)
    image.save(destination, "WEBP", quality=quality, method=6)


def export(source: Path, destination: Path, box=None, max_width: int = 2200, quality: int = 84) -> None:
    image = open_rgb(source)
    if box is not None:
        image = crop_fraction(image, box)
    save_webp(image, destination, max_width=max_width, quality=quality)


portfolio = ROOT / "tmp" / "pdfs" / "architecture-portfolio"
practice_exports = {
    "qianhai-shimao.webp": (portfolio / "page-3.png", (0.06, 0.66, 0.94, 0.97)),
    "foshan-jinzhu.webp": (portfolio / "page-3.png", (0.06, 0.21, 0.94, 0.46)),
    "heshan-ocean-world.webp": (portfolio / "page-4.png", (0.06, 0.20, 0.94, 0.52)),
    "guangzhou-najin.webp": (portfolio / "page-4.png", (0.06, 0.70, 0.94, 0.96)),
    "shenzhen-junior-school.webp": (portfolio / "page-5.png", (0.06, 0.21, 0.94, 0.49)),
    "architectural-sketches.webp": (portfolio / "page-5.png", (0.05, 0.72, 0.95, 0.97)),
    "chongqing-tianan.webp": (portfolio / "page-2.png", (0.35, 0.245, 0.46, 0.37)),
    "dongguan-songshanhu.webp": (portfolio / "page-2.png", (0.35, 0.72, 0.46, 0.83)),
}
for name, (source, box) in practice_exports.items():
    export(source, PUBLIC / "architecture-practice" / name, box=box, max_width=1800)


emotion = ROOT / "tmp" / "pdfs" / "emotion-time"
for index in range(1, 6):
    export(
        emotion / f"page-{index}.png",
        PUBLIC / "emotion-time" / f"revised-{index}.webp",
        max_width=2200,
    )

emotion_original = Path(
    "/Volumes/Han/From 旧电脑 - 待整理/Present（待转移）/LAC/1 - 项目1/0 - UIA原版作品"
)
for index in range(1, 4):
    export(
        emotion_original / f"Page-{index}.png",
        PUBLIC / "emotion-time" / f"original-{index}.webp",
        max_width=2000,
        quality=82,
    )


vertical_city = Path(
    "/Volumes/Han/XAUT/作业/毕业设计/成果提交/12-成果/04-答辩"
)
vertical_prefix = "3131642013-建筑131-张晗-西安保利曲江春天里小区设计"
for index in range(1, 7):
    export(
        vertical_city / f"{vertical_prefix} ({index}).jpg",
        PUBLIC / "vertical-city" / f"board-{index}.webp",
        max_width=2200,
        quality=82,
    )
export(
    vertical_city / f"{vertical_prefix} (1).jpg",
    PUBLIC / "vertical-city" / "hero.webp",
    box=(0.30, 0.39, 0.99, 0.99),
    max_width=2400,
    quality=86,
)


mirriedge_source = Path(
    "/Volumes/Han/XAUT/作业/建筑设计8歌剧院/成图排版/20170630.jpg"
)
mirriedge_exports = {
    "hero.webp": (0.0, 0.0, 1.0, 0.18),
    "concept.webp": (0.0, 0.14, 1.0, 0.48),
    "technical.webp": (0.0, 0.44, 1.0, 0.82),
    "experience.webp": (0.0, 0.81, 1.0, 1.0),
}
for name, box in mirriedge_exports.items():
    export(
        mirriedge_source,
        PUBLIC / "mirriedge" / name,
        box=box,
        max_width=2200,
        quality=84,
    )


favicon = Image.new("RGB", (96, 96), "#151515")
draw = ImageDraw.Draw(favicon)
font = ImageFont.load_default(size=40)
text = "HZ"
text_box = draw.textbbox((0, 0), text, font=font)
draw.text(
    ((96 - (text_box[2] - text_box[0])) / 2, (96 - (text_box[3] - text_box[1])) / 2 - 4),
    text,
    fill="#f3f0e8",
    font=font,
)
favicon.save(ROOT / "public" / "favicon.png", "PNG")
