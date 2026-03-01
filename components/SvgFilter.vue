<docs>
	创造新的滤镜效果！
</docs>

<template>
	<Teleport to="body">
		<svg id="svg-filters" width="0" height="0" aria-hidden>
			<defs>
				<filter id="posterize">
					<feComponentTransfer>
						<feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1" />
						<feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1" />
						<feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1" />
					</feComponentTransfer>
				</filter>
				<filter id="spectrum" colorInterpolationFilters="sRGB">
					<feColorMatrix
						type="matrix"
						values="
							0.33 0.33 0.33 0 0
							0.33 0.33 0.33 0 0
							0.33 0.33 0.33 0 0
							0 0 0 1 0
						"
						in="SourceGraphic"
						result="colorMatrix" />
					<feComponentTransfer in="colorMatrix" result="componentTransfer">
						<feFuncR type="table" tableValues="1 1 0 0 0 1 1" />
						<feFuncG type="table" tableValues="0 1 1 1 0 0 0" />
						<feFuncB type="table" tableValues="0 0 0 1 1 1 0" />
						<feFuncA type="table" tableValues="0 1" />
					</feComponentTransfer>
					<feBlend mode="normal" in="componentTransfer" in2="SourceGraphic" result="blend" />
				</filter>
				<filter id="thermal" colorInterpolationFilters="sRGB">
					<feComponentTransfer>
						<feFuncR type="table" tableValues="0 0.125 0.8   1     1" />
						<feFuncG type="table" tableValues="0 0     0     0.843 1" />
						<feFuncB type="table" tableValues="0 0.549 0.466 0     1" />
					</feComponentTransfer>
				</filter>
				<filter id="emboss">
					<feConvolveMatrix
						order="3 3"
						preserveAlpha="true"
						kernelMatrix="
							1 0 0
							0 0 0
							0 0 -1
						"
						divisor="1"
						bias="0.2" />
				</filter>
				<filter id="bump">
					<feConvolveMatrix
						order="5 5"
						preserveAlpha="true"
						kernelMatrix="
							0.5 0 0 0 0
							0 1 0 0 0
							0 0 -1.5 0 0
							0.3 0 0 0 0
							0 0 0 0 0
						" />
				</filter>
				<filter id="edge">
					<feConvolveMatrix
						order="3 3"
						preserveAlpha="true"
						kernelMatrix="
							1 1 1
							1 -8 1
							1 1 1
						" />
				</filter>
			</defs>
		</svg>
	</Teleport>
</template>
