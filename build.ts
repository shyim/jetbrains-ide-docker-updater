const productKeys = [
    'PS', // PhpStorm
    'GO', // GoLand
    'IIU', // InteliJ Ultimate
];

async function main() {
    const ghConfig = {
        'fail-fast': false,
        matrix: {
            include: [] as any
        }
    };

    for (let productKey of productKeys) {
        let json = await (await fetch(`https://data.services.jetbrains.com/products/releases?code=${productKey}&latest=true&type=release&build=&_=${new Date().getTime()}`)).json() as any;

        for (let release of json[productKey]) {
            ghConfig.matrix.include.push({
                name: `${productKey} ${release.version}`,
                runs: {
                    build: ` cd projector-docker; ./build-container.sh ghcr.io/shyim/jetbrains-ide/${productKey.toLowerCase()}:${release.version} ${release.downloads.linux.link}; docker push ghcr.io/shyim/jetbrains-ide/${productKey.toLowerCase()}:${release.version}`
                }
            });
        }
    }

    await Deno.stdout.write(new TextEncoder().encode(JSON.stringify(ghConfig)));
}

main();
