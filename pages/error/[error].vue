<script setup lang="ts">
	definePageMeta({
		validate: route => {
			const error = +route.params.error;
			if (error === 404)
				return false;
			if (Number.isFinite(error))
				return true;
			return false;
		},
	});
</script>
