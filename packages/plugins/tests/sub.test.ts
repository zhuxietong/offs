import { DisposeBag, PublishSub } from '@offs/core';


describe('coreFunction', () => {
  it('should log "Core function"', () => {
    let action: PublishSub<string> | undefined = new PublishSub<string>();

    const bag = new DisposeBag();

    action
      .subscribe((v) => {
        console.log('action"', v);
      })
      .disposedBy(bag);

    let index = 0;
    setInterval(() => {
      action && (action!.value = index.toString());
      index++;
    }, 2000);

    setTimeout(() => {
      console.warn('close');
      action = undefined;
    }, 10000);

    setTimeout(() => {}, 1000000);
  });
});
