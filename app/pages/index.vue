<script setup lang="ts">
const user = useSupabaseUser();

await navigateTo(user.value ? "/dashboard" : "/login", {
  replace: true,
});
</script>
