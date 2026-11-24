import { useEffect } from 'react'

const revealSelector = '[data-reveal]'

function forEachTarget(node, callback) {
  if (!(node instanceof Element)) return
  if (node.matches(revealSelector)) callback(node)
  node.querySelectorAll(revealSelector).forEach(callback)
}

export function useScrollReveal(scopeRef, pathname) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope || !window.IntersectionObserver || !window.MutationObserver) return

    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const visited = new WeakSet()
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting || target.dataset.revealState !== 'pending') continue
        observer.unobserve(target)
        target.dataset.revealState = 'entering'
      }
    })

    function clearReveal(target) {
      observer.unobserve(target)
      delete target.dataset.revealState
    }

    function observeBelowViewport(target) {
      if (!motion.matches || visited.has(target)) return
      visited.add(target)
      if (target.getBoundingClientRect().top < window.innerHeight) return

      target.dataset.revealState = 'pending'
      observer.observe(target)
    }

    function revealFocused({ target }) {
      const block = target.closest(revealSelector)
      if (block) clearReveal(block)
    }

    function finishAnimation({ animationName, target }) {
      if (animationName === 'scroll-reveal') clearReveal(target)
    }

    function updateMotion() {
      if (motion.matches) forEachTarget(scope, observeBelowViewport)
      else scope.querySelectorAll('[data-reveal-state]').forEach(clearReveal)
    }

    // Filters, pagination and asynchronous panels can insert targets after the first render.
    const mutations = new MutationObserver((records) => {
      for (const { addedNodes, removedNodes } of records) {
        for (const node of removedNodes) {
          if (!scope.contains(node)) forEachTarget(node, clearReveal)
        }
        for (const node of addedNodes) {
          if (scope.contains(node)) forEachTarget(node, observeBelowViewport)
        }
      }
    })

    updateMotion()
    mutations.observe(scope, { childList: true, subtree: true })
    motion.addEventListener('change', updateMotion)
    scope.addEventListener('focusin', revealFocused)
    scope.addEventListener('animationend', finishAnimation)
    scope.addEventListener('animationcancel', finishAnimation)

    return () => {
      mutations.disconnect()
      observer.disconnect()
      motion.removeEventListener('change', updateMotion)
      scope.removeEventListener('focusin', revealFocused)
      scope.removeEventListener('animationend', finishAnimation)
      scope.removeEventListener('animationcancel', finishAnimation)
      scope.querySelectorAll('[data-reveal-state]').forEach(clearReveal)
    }
  }, [scopeRef, pathname])
}
