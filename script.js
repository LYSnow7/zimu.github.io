// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const imageInput = document.getElementById('imageInput');
    const uploadedImage = document.getElementById('uploadedImage');
    const subtitleContainer = document.getElementById('subtitleContainer');
    const subtitleText = document.getElementById('subtitleText');
    const fontHeight = document.getElementById('fontHeight');
    const fontSize = document.getElementById('fontSize');
    const fontColor = document.getElementById('fontColor');
    const outlineColor = document.getElementById('outlineColor');
    const saveButton = document.getElementById('saveImage');

    // 图片上传处理
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                uploadedImage.classList.remove('d-none');
                // 等待图片加载完成后再更新字幕
                uploadedImage.onload = function() {
                    updateSubtitles(); // 更新字幕显示
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // 字幕文本变化监听
    subtitleText.addEventListener('input', updateSubtitles);

    // 字体高度变化监听
    fontHeight.addEventListener('input', updateSubtitles);

    // 字体大小变化监听
    fontSize.addEventListener('input', updateSubtitles);

    // 字体颜色变化监听
    fontColor.addEventListener('input', updateSubtitles);

    // 轮廓颜色变化监听
    outlineColor.addEventListener('input', updateSubtitles);

    // 更新字幕显示
    function updateSubtitles() {
        // 清空现有字幕
        subtitleContainer.innerHTML = '';

        // 获取字幕文本并按行分割
        const lines = subtitleText.value.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0 || uploadedImage.classList.contains('d-none')) {
            return; // 如果没有字幕文本或没有上传图片，则不显示字幕
        }

        // 获取字体高度和大小
        const height = parseInt(fontHeight.value);
        const size = parseInt(fontSize.value);

        // 创建字幕元素
        lines.forEach((line, index) => {
            // 创建字幕包装器
            const subtitleWrapper = document.createElement('div');
            subtitleWrapper.className = 'subtitle-wrapper';
            subtitleWrapper.style.bottom = `${index * height}px`; // 从底部向上排列

            // 创建字幕文本元素
            const subtitle = document.createElement('div');
            subtitle.className = 'subtitle-text';
            subtitle.textContent = line;
            subtitle.style.fontSize = `${size}px`;
            subtitle.style.color = fontColor.value;
            subtitle.style.backgroundColor = outlineColor.value;
            subtitle.style.height = `${height}px`;
            subtitle.style.lineHeight = `${height}px`; // 垂直居中文本
            
            subtitleWrapper.appendChild(subtitle);
            subtitleContainer.appendChild(subtitleWrapper);
        });
    }

    // 保存图片
    saveButton.addEventListener('click', async function() {
        try {
            // 确保图片已上传
            if (uploadedImage.classList.contains('d-none')) {
                alert('请先上传图片');
                return;
            }

            // 确保有字幕文本
            if (subtitleText.value.trim() === '') {
                alert('请输入字幕内容');
                return;
            }

            // 使用html2canvas捕获预览区域
            const canvas = await html2canvas(document.getElementById('previewArea'), {
                backgroundColor: null,
                scale: 2, // 提高输出质量
                logging: false
            });

            // 创建下载链接
            const link = document.createElement('a');
            link.download = '字幕图片.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('保存图片失败:', error);
            alert('保存图片失败，请重试');
        }
    });
});